import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { Authenticator } from 'remix-auth';
import type { SessionStorage } from '@remix-run/cloudflare';
import { GitHubStrategy } from 'remix-auth-github';
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

  constructor(env: RemixServer.Env, hostname: string) {
    let sessionStorage = createCookieSessionStorage({
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

    let callbackURL = new URL(env.GITHUB_CALLBACK_URL);
    callbackURL.hostname = hostname;

    this.#authenticator.use(
      new GitHubStrategy(
        {
          clientID: env.GITHUB_ID,
          clientSecret: env.GITHUB_SECRET,
          callbackURL: callbackURL.toString()
        },
        async ({ profile }) => {
          return {
            displayName: profile._json.name,
            username: profile._json.login,
            email: profile._json.email ?? profile.emails?.at(0) ?? null,
            avatar: profile._json.avatar_url,
            githubId: profile._json.node_id
            // isSponsor: await gh.isSponsoringMe(profile._json.node_id)
          };
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
