// In-memory rate limiter for development
// TODO: Replace with Redis (Upstash/Vercel KV) for production
class InMemoryRateLimit {
  private requests = new Map<string, { count: number; resetTime: number }>();

  async check(identifier: string, limit: number, windowMs: number) {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / windowMs)}`;

    const current = this.requests.get(key) || {
      count: 0,
      resetTime: now + windowMs,
    };

    if (now > current.resetTime) {
      current.count = 1;
      current.resetTime = now + windowMs;
    } else if (current.count >= limit) {
      return { success: false, reset: current.resetTime };
    } else {
      current.count++;
    }

    this.requests.set(key, current);
    return { success: true, reset: current.resetTime };
  }
}

const rateLimiter = new InMemoryRateLimit();

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 10000
) {
  return await rateLimiter.check(identifier, limit, windowMs);
}

// Predefined rate limits
export const RATE_LIMITS = {
  API_GENERAL: { limit: 50, windowMs: 60000 }, // 50 requests per minute
  QUOTE_CREATE: { limit: 5, windowMs: 3600000 }, // 5 quotes per hour
  CONTACT_SUBMIT: { limit: 3, windowMs: 3600000 }, // 3 contact submissions per hour
  AUTH_ATTEMPT: { limit: 5, windowMs: 900000 }, // 5 auth attempts per 15 minutes
} as const;
