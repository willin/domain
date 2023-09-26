import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { EnvSchema } from './env';
import { AuthService } from './services/auth';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: async (ctx) => {
    const env = EnvSchema.parse(ctx.env);

    const url = new URL(ctx.request.url);
    const { hostname } = url;
    const auth = new AuthService(env, hostname);
    const services: RemixServer.Services = {
      auth
    };
    return { env, services };
  },
  mode: build.mode
});
