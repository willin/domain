import { AuthConfig } from '@auth/core';
import GithubProvider from '@auth/core/providers/github';

export const authOptions: AuthConfig = {
  secret: process.env.GITHUB_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }) as any
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
