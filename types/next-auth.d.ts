import NextAuth, { DefaultSession } from 'next-auth';
import { CFResult } from '@/lib/dns';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username: string;
      uid: number;
      vip: boolean;
      admin: boolean;
      records?: CFResult['result'][];
    } & DefaultSession['user'];
  }
}
