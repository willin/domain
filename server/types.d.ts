import type { Env } from './env';
import type { IAuthService } from './services/auth';
import type { IRecordService } from './services/records';

declare global {
  namespace RemixServer {
    export { Env };
    export interface Services {
      auth: IAuthService;
      records: IRecordService;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
    CACHE: KVNamespace;
    RECORDS: D1Database;
    services: RemixServer.Services;
  }
}
