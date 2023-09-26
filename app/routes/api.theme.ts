import {
  type LoaderFunction,
  redirect,
  type ActionFunction,
  json
} from '@remix-run/cloudflare';
import { z } from 'zod';
import { sessionStore } from '~/helpers/session';
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
      const session = await sessionStore.getSession(
        request.headers.get('Cookie')
      );
      session.set('theme', theme);
      return json(
        { success: true },
        {
          headers: {
            'Set-Cookie': await sessionStore.commitSession(session)
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
