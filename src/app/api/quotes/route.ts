import { emailService } from '@/lib/email';
import { createApiResponse, handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import {
  formRateLimiter,
  isSQLInjection,
  isXSS,
  quoteFormSchema,
  sanitizeEmail,
  sanitizeString,
} from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(
      parseInt(searchParams.get('pageSize') || '10'),
      100
    );
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
              company: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
          communications: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quote.count({ where }),
    ]);

    return createApiResponse({
      data: quotes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    // Check form submission rate limit
    const rateLimitCheck = formRateLimiter.canSubmit(`quote:${ip}`);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: true,
          message:
            rateLimitCheck.reason ||
            'Demasiadas solicitudes. Intente nuevamente más tarde.',
          timestamp: new Date().toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (rateLimitCheck.waitTime || 30000) / 1000
            ).toString(),
          },
        }
      );
    }

    const body = await request.json();

    // Sanitize input data
    const sanitizedBody = {
      customerName: sanitizeString(body.customerName || ''),
      customerEmail: sanitizeEmail(body.customerEmail || ''),
      customerPhone: body.customerPhone
        ? sanitizeString(body.customerPhone)
        : undefined,
      company: body.company ? sanitizeString(body.company) : undefined,
      countryId: body.countryId,
      recipientEmail: body.recipientEmail
        ? sanitizeEmail(body.recipientEmail)
        : undefined,
      shippingAddress: body.shippingAddress,
      message: body.message ? sanitizeString(body.message) : undefined,
      items:
        body.items?.map((item: any) => ({
          productId: item.productId,
          measureId: item.measureId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes ? sanitizeString(item.notes) : undefined,
          specifications: item.specifications,
        })) || [],
    };

    // Check for malicious content in text fields
    const textFields = [
      sanitizedBody.customerName,
      sanitizedBody.customerEmail,
      sanitizedBody.message,
    ];
    if (sanitizedBody.company) textFields.push(sanitizedBody.company);
    if (sanitizedBody.recipientEmail)
      textFields.push(sanitizedBody.recipientEmail);
    sanitizedBody.items.forEach((item: any) => {
      if (item.notes) textFields.push(item.notes);
    });

    for (const field of textFields) {
      if (field && (isXSS(field) || isSQLInjection(field))) {
        console.warn(`Malicious content detected in quote form from IP: ${ip}`);
        return createApiResponse(null, 'Contenido no válido detectado.', 400);
      }
    }

    // Validate with enhanced schema
    const validatedData = quoteFormSchema.parse(sanitizedBody);

    // Generate quote number
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
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
          create: validatedData.items.map((item: any) => ({
            productId: item.productId,
            measureId: item.measureId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            totalPrice: (item.unitPrice || 0) * item.quantity,
            notes: item.notes,
            specifications: item.specifications,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
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
          country: (quote as any).countryRef?.name,
          currency: 'USD', // TODO: Fetch actual currency from currencyId
          currencyId: quote.currencyId,
          totalAmount: quote.totalAmount
            ? Number(quote.totalAmount)
            : undefined,
          items: (quote as any).items.map((item: any) => ({
            productName: item.product?.name || 'Producto',
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
          })),
          message: quote.message || undefined,
          quoteNumber: quote.quoteNumber,
        };

        emailSent = await emailService.sendQuoteEmail(
          emailData,
          validatedData.recipientEmail
        );

        // Update email status
        await prisma.quote.update({
          where: { id: quote.id },
          data: {
            emailStatus: emailSent ? 'sent' : 'failed',
            emailSentAt: emailSent ? new Date() : null,
          },
        });

        logger.info('Quote email sent', { quoteId: quote.id, emailSent });
      } catch (emailError) {
        logger.error('Failed to send quote email', {
          error: emailError,
          quoteId: quote.id,
        });
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
          emailSent,
        }),
      },
    });

    return createApiResponse(
      {
        ...quote,
        emailSent,
      },
      'Cotización creada exitosamente',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
