import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { AdminId } from './config';

export const authOptions: NextAuthOptions = {
  secret: process.env.GITHUB_SECRET || '',
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (session?.user) {
        const username = token.username as string;
        Object.assign(session.user, {
          uid: token.uid,
          username,
          // TODO: TBD, async function available
          vip: ['willin'].includes(username),
          admin: [AdminId].includes(username)
        });
      }
      return session;
    },
    jwt: ({ profile, token }) => {
      if (profile) {
        const { login, id } = profile as { login: string; id: number };
        Object.assign(token, { username: login, uid: id });
      }

      return token;
    }
  },
  session: {
    strategy: 'jwt'
  }
};
