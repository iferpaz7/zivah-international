import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, createApiResponse } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 50 requests per minute
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimit = await checkRateLimit(
      `api:${ip}`,
      RATE_LIMITS.API_GENERAL.limit,
      RATE_LIMITS.API_GENERAL.windowMs
    );

    if (!rateLimit.success) {
      return createApiResponse(
        null,
        'Demasiadas solicitudes. Intente nuevamente más tarde.',
        429
      );
    }

    const measures = await prisma.measure.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        symbol: true,
        type: true,
        baseUnit: true,
        conversionFactor: true,
        description: true,
      },
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
    });

    return createApiResponse(measures);
  } catch (error) {
    return handleApiError(error);
  }
}
