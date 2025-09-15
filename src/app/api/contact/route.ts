import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSubmissionSchema } from '@/lib/validations';
import { handleApiError, createApiResponse } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 contact submissions per hour per IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const rateLimit = await checkRateLimit(
      `contact:${ip}`,
      RATE_LIMITS.CONTACT_SUBMIT.limit,
      RATE_LIMITS.CONTACT_SUBMIT.windowMs
    );

    if (!rateLimit.success) {
      return createApiResponse(null, 'Demasiadas solicitudes. Intente nuevamente más tarde.', 429);
    }

    const body = await request.json();
    const validatedData = contactSubmissionSchema.parse(body);
    
    const contactSubmission = await prisma.contactSubmission.create({
      data: validatedData
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CONTACT_SUBMISSION',
        entityType: 'ContactSubmission',
        entityId: contactSubmission.id,
        details: JSON.stringify({
          contactId: contactSubmission.id,
          email: contactSubmission.email,
          type: contactSubmission.type,
          company: contactSubmission.company
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