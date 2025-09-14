import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createQuoteSchema, updateQuoteSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = parseInt(userId);

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  basePrice: true
                }
              }
            }
          },
          communications: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 5
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.quote.count({ where })
    ]);

    return NextResponse.json({
      error: false,
      data: quotes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching quotes:', error);
    
    return NextResponse.json({
      error: true,
      message: 'Error interno del servidor al obtener cotizaciones',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createQuoteSchema.parse(body);
    
    const quote = await prisma.quote.create({
      data: {
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        company: validatedData.company,
        country: validatedData.country,
        shippingAddress: validatedData.shippingAddress,
        message: validatedData.message,
        status: 'PENDING',
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            notes: item.notes,
            specifications: item.specifications
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                basePrice: true
              }
            }
          }
        }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE_QUOTE',
        entityType: 'Quote',
        entityId: quote.id,
        details: JSON.stringify({
          quoteId: quote.id,
          itemsCount: quote.items.length,
          company: quote.company,
          customerEmail: quote.customerEmail
        })
      }
    });

    return NextResponse.json({
      error: false,
      data: quote,
      message: 'Cotización creada exitosamente',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating quote:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: true,
        message: 'Datos de cotización inválidos',
        details: error.issues,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    return NextResponse.json({
      error: true,
      message: 'Error interno del servidor al crear cotización',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}