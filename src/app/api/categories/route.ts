import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCategorySchema, updateCategorySchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const includeProducts = searchParams.get('includeProducts') === 'true';
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
        ...(includeProducts && {
          products: {
            where: {
              isActive: true,
            },
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              isFeatured: true,
            },
            take: 5,
          },
        }),
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });

    return NextResponse.json({
      error: false,
      data: categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al obtener categorías',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    // Auto-generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    // Check if slug is unique
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          error: true,
          message: 'Ya existe una categoría con este slug',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: validatedData as any, // Type assertion to handle the slug field
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        error: false,
        data: category,
        message: 'Categoría creada exitosamente',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: true,
          message: 'Datos de categoría inválidos',
          details: error.issues,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al crear categoría',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
