// Import from next-auth/next for Next.js route handlers (v4)
import NextAuth from 'next-auth/next';

import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
