// Product Pricing Service
// Database-driven pricing service using Prisma

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductPricingService {
  getAvailableMeasuresForProduct(productId: number): Promise<any[]>;
  getPriceForUnit(productId: number, measureId: number): Promise<number | null>;
  getTotalPrice(
    productId: number,
    measureId: number,
    quantity: number
  ): Promise<number | null>;
  areMeasuresCompatible(
    fromMeasureId: number,
    toMeasureId: number
  ): Promise<boolean>;
}

class DatabasePricingService implements ProductPricingService {
  async getAvailableMeasuresForProduct(productId: number): Promise<any[]> {
    try {
      // Get product with its pricing information
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          productPrices: {
            where: { isActive: true },
            include: { measure: true },
          },
          defaultMeasure: true,
        },
      });

      if (!product) {
        return [];
      }

      // Get all measures in the same family as the product's default measure
      const defaultFamily = product.defaultMeasure?.familyId;
      if (!defaultFamily) {
        return [];
      }

      const measures = await prisma.measure.findMany({
        where: {
          familyId: defaultFamily,
          isActive: true,
        },
        orderBy: { sortOrder: 'asc' },
      });

      return measures;
    } catch (error) {
      console.error('Error getting available measures:', error);
      return [];
    }
  }

  async getPriceForUnit(
    productId: number,
    measureId: number
  ): Promise<number | null> {
    try {
      const productPrice = await prisma.productPrice.findUnique({
        where: {
          productId_measureId: {
            productId,
            measureId,
          },
          isActive: true,
        },
      });

      if (productPrice) {
        return Number(productPrice.price);
      }

      // If no direct price, try to find compatible measures and convert
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { productPrices: { include: { measure: true } } },
      });

      if (!product || !product.productPrices.length) {
        return null;
      }

      // Find a price in a compatible measure and convert
      for (const price of product.productPrices) {
        if (price.measureId === measureId) {
          return Number(price.price);
        }

        // Check if measures are compatible
        const compatibility = await prisma.measureCompatibility.findUnique({
          where: {
            fromMeasureId_toMeasureId: {
              fromMeasureId: price.measureId,
              toMeasureId: measureId,
            },
          },
        });

        if (compatibility && compatibility.conversionFactor) {
          // Convert price: if converting from A to B with factor F, price_B = price_A / F
          return Number(price.price) / Number(compatibility.conversionFactor);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting price for unit:', error);
      return null;
    }
  }

  async getTotalPrice(
    productId: number,
    measureId: number,
    quantity: number
  ): Promise<number | null> {
    const unitPrice = await this.getPriceForUnit(productId, measureId);
    if (unitPrice === null) {
      return null;
    }
    return unitPrice * quantity;
  }

  async areMeasuresCompatible(
    fromMeasureId: number,
    toMeasureId: number
  ): Promise<boolean> {
    try {
      // Same measure is always compatible
      if (fromMeasureId === toMeasureId) {
        return true;
      }

      // Check direct compatibility
      const compatibility = await prisma.measureCompatibility.findUnique({
        where: {
          fromMeasureId_toMeasureId: {
            fromMeasureId,
            toMeasureId,
          },
        },
      });

      if (compatibility) {
        return true;
      }

      // Check if they belong to the same family
      const [fromMeasure, toMeasure] = await Promise.all([
        prisma.measure.findUnique({ where: { id: fromMeasureId } }),
        prisma.measure.findUnique({ where: { id: toMeasureId } }),
      ]);

      if (
        fromMeasure &&
        toMeasure &&
        fromMeasure.familyId === toMeasure.familyId
      ) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking measure compatibility:', error);
      return false;
    }
  }
}

// Export the service instance
export const pricingService: ProductPricingService =
  new DatabasePricingService();
