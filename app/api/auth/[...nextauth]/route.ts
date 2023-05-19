import { NextAuth, NextAuthConfig } from '@auth/nextjs';
import { authOptions } from '@/lib/next-auth';

const { handlers } = NextAuth(authOptions as NextAuthConfig);

const { GET, POST } = handlers;
export { GET, POST };
export const runtime = 'edge';
