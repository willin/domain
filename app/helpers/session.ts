import { createCookieSessionStorage } from '@remix-run/cloudflare';

export const sessionStore = createCookieSessionStorage({
  cookie: {
    secure: true,
    sameSite: 'lax',
    secrets: ['wi11inw2n9'],
    path: '/',
    expires: new Date(new Date().getTime() + 86400000 * 36500),
    httpOnly: true
  }
});
