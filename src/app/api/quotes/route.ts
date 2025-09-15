import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createQuoteSchema, productFiltersSchema } from '@/lib/validations';
import { handleApiError, createApiResponse } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { emailService } from '@/lib/email';
import { logger } from '@/lib/logger';

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

    return createApiResponse({
      data: quotes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}


export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 quotes per hour per IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const rateLimit = await checkRateLimit(
      `quote:${ip}`,
      RATE_LIMITS.QUOTE_CREATE.limit,
      RATE_LIMITS.QUOTE_CREATE.windowMs
    );

    if (!rateLimit.success) {
      return createApiResponse(null, 'Demasiadas solicitudes. Intente nuevamente más tarde.', 429);
    }

    const body = await request.json();
    const validatedData = createQuoteSchema.parse(body);

    // Generate quote number
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    const quoteNumber = `Q${String((lastQuote?.id || 0) + 1).padStart(6, '0')}`;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        company: validatedData.company,
        countryId: validatedData.countryId,
        shippingAddress: validatedData.shippingAddress,
        message: validatedData.message,
        status: 'PENDING',
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            totalPrice: (item.unitPrice || 0) * item.quantity,
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
        countryRef: {
          select: {
            name: true
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

    // Send email if requested
    let emailSent = false;
    if (validatedData.recipientEmail) {
      try {
        const emailData = {
          quoteId: quote.id,
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          company: quote.company || undefined,
          country: quote.countryRef?.name,
          currency: quote.currency,
          totalAmount: quote.totalAmount ? Number(quote.totalAmount) : undefined,
          items: quote.items.map(item => ({
            productName: item.product?.name || 'Producto',
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice)
          })),
          message: quote.message || undefined,
          quoteNumber: quote.quoteNumber
        };

        emailSent = await emailService.sendQuoteEmail(emailData, validatedData.recipientEmail);

        // Update email status
        await prisma.quote.update({
          where: { id: quote.id },
          data: {
            emailStatus: emailSent ? 'sent' : 'failed',
            emailSentAt: emailSent ? new Date() : null
          }
        });

        logger.info('Quote email sent', { quoteId: quote.id, emailSent });

      } catch (emailError) {
        logger.error('Failed to send quote email', { error: emailError, quoteId: quote.id });
        // Don't fail the quote creation, just log the email failure
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE_QUOTE',
        entityType: 'Quote',
        entityId: quote.id,
        details: JSON.stringify({
          quoteId: quote.id,
          itemsCount: validatedData.items.length,
          company: quote.company,
          customerEmail: quote.customerEmail,
          emailSent
        })
      }
    });

    return createApiResponse({
      ...quote,
      emailSent
    }, 'Cotización creada exitosamente', 201);

  } catch (error) {
    return handleApiError(error);
  }
}