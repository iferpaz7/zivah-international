import { NextRequest } from 'next/server';

import { createApiResponse, handleApiError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 50 requests per minute
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = await checkRateLimit(
      `api:${ip}`,
      RATE_LIMITS.API_GENERAL.limit,
      RATE_LIMITS.API_GENERAL.windowMs
    );

    if (!rateLimit.success) {
      return createApiResponse(null, 'Demasiadas solicitudes. Intente nuevamente más tarde.', 429);
    }

    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        icon: true,
        currency: true,
        callingCode: true,
        phoneFormat: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return createApiResponse(countries);
  } catch (error) {
    return handleApiError(error);
  }
}
