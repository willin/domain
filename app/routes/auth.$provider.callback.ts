import type { LoaderFunction } from '@remix-run/cloudflare';
import { z } from 'zod';

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const provider = z.enum(['github']).parse(params.provider);
  const referer = params.redirect_uri;
  const returnPath = referer ? new URL(referer).pathname : '/';

  return await context.services.auth.authenticator.authenticate(provider, request, {
    successRedirect: returnPath,
    failureRedirect: returnPath
  });
};
