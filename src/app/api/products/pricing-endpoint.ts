// API endpoint to get product pricing for different measures
// File: src/app/api/products/[id]/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Get product with all its pricing information
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: {
        defaultMeasure: true,
        productPrices: {
          where: { isActive: true },
          include: {
            measure: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get compatible measures for this product's family
    const measureConditions = [];
    if (product.defaultMeasure?.familyId) {
      measureConditions.push({ familyId: product.defaultMeasure.familyId });
    }
    if (product.measureId) {
      measureConditions.push({ id: product.measureId });
    }

    const compatibleMeasures = await prisma.measure.findMany({
      where: {
        OR: measureConditions,
        isActive: true,
      },
      orderBy: [{ familyId: 'asc' }, { sortOrder: 'asc' }],
    });

    // Build pricing matrix
    const pricingData = compatibleMeasures.map((measure: any) => {
      // Check if there's a specific price for this measure
      const specificPrice = product.productPrices.find((pp: any) => pp.measureId === measure.id);

      let unitPrice = null;
      let priceType = 'unavailable';

      if (specificPrice) {
        unitPrice = parseFloat(specificPrice.price.toString());
        priceType = 'specific';
      } else if (measure.id === product.measureId) {
        // This is the base measure - no longer have basePrice, mark as unavailable
        unitPrice = null;
        priceType = 'unavailable';
      } else {
        // Check if there's a conversion factor
        // For now, we'll leave this as unavailable unless there's a specific price
        priceType = 'unavailable';
      }

      return {
        measureId: measure.id,
        measureName: measure.name,
        measureShortName: measure.shortName,
        measureSymbol: measure.symbol,
        measureType: measure.type,
        measureFamily: measure.family,
        unitPrice,
        priceType,
        isAvailable: unitPrice !== null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        productId: product.id,
        productName: product.name,
        baseMeasure: product.defaultMeasure,
        availablePricing: pricingData.filter((p: any) => p.isAvailable),
        allMeasures: pricingData,
      },
    });
  } catch (error) {
    console.error('Error fetching product pricing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
