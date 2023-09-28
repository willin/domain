import { type LoaderFunction } from '@remix-run/cloudflare';

const xml = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://domain.willin.wang</loc>
<lastmod>$1</lastmod>
</url>
<url>
<loc>https://domain.willin.wang/en</loc>
<lastmod>$1</lastmod>
</url>
<url>
<loc>https://domain.willin.wang/zh</loc>
<lastmod>$1</lastmod>
</url>
</urlset>
`;

export const loader: LoaderFunction = () => {
  return new Response(xml.replace(/\$1/g, new Date().toISOString()), {
    headers: {
      'content-type': 'application/xml'
    }
  });
};
