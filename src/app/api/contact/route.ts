import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactFormSchema, formRateLimiter, sanitizeString, sanitizeEmail, isXSS, isSQLInjection } from '@/lib/validation';
import { handleApiError, createApiResponse } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               request.headers.get('cf-connecting-ip') ||
               'unknown';

    // Check form submission rate limit
    const rateLimitCheck = formRateLimiter.canSubmit(`contact:${ip}`);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({
        error: true,
        message: rateLimitCheck.reason || 'Demasiadas solicitudes. Intente nuevamente más tarde.',
        timestamp: new Date().toISOString()
      }, {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitCheck.waitTime || 30000) / 1000).toString()
        }
      });
    }

    const body = await request.json();

    // Sanitize input data
    const sanitizedBody = {
      name: sanitizeString(body.name || ''),
      email: sanitizeEmail(body.email || ''),
      phone: body.phone ? sanitizeString(body.phone) : undefined,
      company: body.company ? sanitizeString(body.company) : undefined,
      message: sanitizeString(body.message || ''),
      subject: body.subject ? sanitizeString(body.subject) : undefined,
    };

    // Check for malicious content
    const textFields = [sanitizedBody.name, sanitizedBody.email, sanitizedBody.message];
    if (sanitizedBody.company) textFields.push(sanitizedBody.company);
    if (sanitizedBody.subject) textFields.push(sanitizedBody.subject);

    for (const field of textFields) {
      if (isXSS(field) || isSQLInjection(field)) {
        console.warn(`Malicious content detected in contact form from IP: ${ip}`);
        return createApiResponse(null, 'Contenido no válido detectado.', 400);
      }
    }

    // Validate with enhanced schema
    const validatedData = contactFormSchema.parse(sanitizedBody);

    const contactSubmission = await prisma.contactSubmission.create({
      data: validatedData
    });

    // Track successful contact submission
    // Note: Business tracking is handled on the client side
    // This is just for server-side logging

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CONTACT_SUBMISSION',
        entityType: 'ContactSubmission',
        entityId: contactSubmission.id,
        details: JSON.stringify({
          contactId: contactSubmission.id,
          email: validatedData.email,
          company: validatedData.company
        })
      }
    });

    return createApiResponse(
      { id: contactSubmission.id },
      'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      201
    );

  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.contactSubmission.count({ where })
    ]);

    return createApiResponse({
      data: submissions,
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