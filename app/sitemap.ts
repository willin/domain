import { i18n } from '@/i18n-config';
import { BaseURL } from '@/lib/config';

export default function sitemap() {
  const defs = [''];
  const lastModified = new Date().toISOString().split('T')[0];

  const routes = ['']
    .concat(...[...i18n.locales.map((lang) => defs.map((path) => `/${lang}${path}`))])
    .map((route) => ({
      url: `${BaseURL}${route}`,
      lastModified
    }));

  return routes;
}
