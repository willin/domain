import { Locale, i18n } from '@/i18n-config';
import { BaseURL } from '@/lib/config';
import dayjs from 'dayjs';

export default function sitemap() {
  // Defined Routes
  const now = dayjs();
  const start = dayjs('2023-05-01');
  const lastModified = new Date().toISOString().split('T')[0];

  const diffDays = now.diff(start, 'day');
  const days = (lang: Locale) =>
    Array.from({ length: diffDays > 450 ? 450 : diffDays }, (_, i) => i).map(
      (i) => `/${lang}/${now.add(-i, 'day').format('YYYY/MM/DD')}`
    );
  const months = (lang: Locale) =>
    Array.from({ length: now.diff(start, 'month') + 1 }, (_, i) => i).map(
      (i) => `/${lang}/${now.add(-i, 'month').format('YYYY/MM')}`
    );
  const years = (lang: Locale) =>
    Array.from({ length: now.diff(start, 'year') + 1 }, (_, i) => i).map(
      (i) => `/${lang}/${now.add(-i, 'year').format('YYYY')}`
    );

  const defs = ['', '/about', '/wallet'];
  const routes = ['']
    .concat(
      ...[
        ...i18n.locales.map((lang) => defs.map((path) => `/${lang}${path}`)),
        ...i18n.locales.map((lang) => years(lang)),
        ...i18n.locales.map((lang) => months(lang)),
        ...i18n.locales.map((lang) => days(lang))
      ]
    )
    .map((route) => ({
      url: `${BaseURL}${route}`,
      lastModified
    }));

  return routes;
}
