import {
  type LoaderFunction,
  type ActionFunction,
  redirect
} from '@remix-run/cloudflare';

export const loader: LoaderFunction = () => {
  return redirect('/');
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const referer = request.headers.get('referer');
  const returnPath = referer ? new URL(referer).pathname : '/';
  return await context.services.auth.authenticator.logout(request, {
    redirectTo: returnPath
  });
};
