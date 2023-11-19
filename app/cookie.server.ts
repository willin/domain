import { type Cookie, createCookie } from '@remix-run/cloudflare';

export const themeCookie: Cookie = createCookie('theme', { httpOnly: true });
