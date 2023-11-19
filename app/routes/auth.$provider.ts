import {
  type LoaderFunction,
  type ActionFunction,
  redirect
} from '@remix-run/cloudflare';
import { z } from 'zod';

export const loader: LoaderFunction = () => {
  return redirect('/');
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const provider = z.enum(['sso']).parse(params.provider);
  const referer = request.headers.get('referer');
  const returnPath = referer ? new URL(referer).pathname : '/';

  return await context.services.auth.authenticator.authenticate(
    provider,
    request,
    {
      successRedirect: '/dashboard',
      failureRedirect: returnPath
    }
  );
};
