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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category');

    const where: any = {
      isActive: true,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,

        description: true,
        sku: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });

    return createApiResponse(products);
  } catch (error) {
    return handleApiError(error);
  }
}
