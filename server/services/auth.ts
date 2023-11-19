import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { Authenticator } from 'remix-auth';
import type { SessionStorage } from '@remix-run/cloudflare';
import { SSOStrategy } from 'remix-auth-sso';
import { z } from 'zod';

const UserSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  email: z.string().email().nullable(),
  avatar: z.string().url(),
  githubId: z.string().min(1),
  isSponsor: z.boolean()
});

const SessionSchema = z.object({
  user: UserSchema.optional(),
  strategy: z.string().optional(),
  'oauth2:state': z.string().uuid().optional(),
  'auth:error': z.object({ message: z.string() }).optional()
});

export type User = z.infer<typeof UserSchema>;

export type Session = z.infer<typeof SessionSchema>;

export interface IAuthService {
  readonly authenticator: Authenticator<User>;
  readonly sessionStorage: TypedSessionStorage<typeof SessionSchema>;
}

export class AuthService implements IAuthService {
  #sessionStorage: SessionStorage<typeof SessionSchema>;
  #authenticator: Authenticator<User>;

  constructor(env: RemixServer.Env, url: URL) {
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: 'sid',
        httpOnly: true,
        secure: env.CF_PAGES === 'production',
        sameSite: 'lax',
        path: '/',
        secrets: [env.COOKIE_SESSION_SECRET]
      }
    });

    this.#sessionStorage = sessionStorage;
    this.#authenticator = new Authenticator<User>(
      this.#sessionStorage as unknown as SessionStorage,
      {
        throwOnError: true
      }
    );

    const callbackURL = `${url.protocol}//${url.hostname}${
      ['80', '443', ''].includes(url.port) ? '' : `:${url.port}`
    }/auth/sso/callback`;
    this.#authenticator.use(
      new SSOStrategy(
        {
          clientID: env.SSO_ID,
          clientSecret: env.SSO_SECRET,
          callbackURL: callbackURL
        },
        async ({ profile }) => {
          return profile;
        }
      )
    );
  }

  get authenticator() {
    return this.#authenticator;
  }

  get sessionStorage() {
    return this.#sessionStorage;
  }
}
