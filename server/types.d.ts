import type { Env } from './env';
import type { IAuthService } from './services/auth';

declare global {
  namespace RemixServer {
    export interface Services {
      auth: IAuthService;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
    DB: D1Database;
    services: RemixServer.Services;
  }
}
