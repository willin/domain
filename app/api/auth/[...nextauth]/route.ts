import NextAuth from '@auth/nextjs';
import { authOptions } from '@/lib/next-auth';

const { handlers } = NextAuth(authOptions);

const { GET, POST } = handlers;
export { GET, POST };
export const runtime = 'edge';
