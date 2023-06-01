import { BaseURL } from '@/lib/config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      },
      {
        userAgent: '*',
        disallow: '/images/'
      }
    ],
    sitemap: BaseURL + '/sitemap.xml',
    host: BaseURL
  };
}
