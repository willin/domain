import { NextAuthConfig } from '@auth/nextjs';
import GithubProvider from '@auth/nextjs/providers/github';

export const authOptions: NextAuthConfig = {
  secret: process.env.GITHUB_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (session?.user) {
        Object.assign(session.user, { uid: token.uid, username: token.username });
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
