import styles from './tailwind.css';
import {
  json,
  redirect,
  type LinksFunction,
  type LoaderFunction
} from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import { ThemeProvider } from './components/use-theme';
import { sessionStore } from './helpers/session';
import { useI18n } from 'remix-i18n';
import DetectLanguage from './components/detect-lang';
import Layout from './components/layout';

export const meta: MetaFunction = () => {
  return [
    { title: 'Willin Wang Free Domains' },
    { name: 'description', content: 'Welcome to Remix!' },
    {
      name: 'keywords',
      content: ['Next.js', 'React', 'JavaScript', 'Willin Wang'].join(', ')
    },
    { name: 'author', content: 'Willin Wang' }
  ];
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/ico' },
  { rel: 'icon', href: '/favicon.png', type: 'image/png' }
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    throw redirect(request.url.slice(0, -1), {
      status: 308
    });
  }
  const session = await sessionStore.getSession(request.headers.get('Cookie'));
  const theme = (session.get('theme') as string) || 'retro';
  const user = await context.services.auth.authenticator.isAuthenticated(
    request
  );

  return json({ theme, user });
};

export default function App() {
  const { theme } = useLoaderData<typeof loader>();
  const i18n = useI18n();

  return (
    <ThemeProvider specifiedTheme={theme}>
      <html lang={i18n.locale()} data-theme={theme}>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width,initial-scale=1' />
          <Meta />
          <Links />
        </head>
        <body>
          <Layout>
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <DetectLanguage />
        </body>
      </html>
    </ThemeProvider>
  );
}
