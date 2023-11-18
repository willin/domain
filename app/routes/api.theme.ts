import {
  type LoaderFunction,
  redirect,
  type ActionFunction,
  json
} from '@remix-run/cloudflare';
import { z } from 'zod';
import { themeCookie } from '~/cookie.server';
import { themes } from '~/themes';

export const loader: LoaderFunction = () => {
  return redirect('/');
};

export const action: ActionFunction = async ({ request }) => {
  const data: { theme: string } = await request.json();
  const theme = z.enum(themes.map((x) => x.id)).parse(data?.theme);

  switch (request.method) {
    case 'PUT':
    case 'POST': {
      return json(
        { success: true },
        {
          headers: {
            'Set-Cookie': await themeCookie.serialize(theme)
          }
        }
      );
    }
    default: {
      return json(
        { success: false },
        {
          status: 403
        }
      );
    }
  }
};
