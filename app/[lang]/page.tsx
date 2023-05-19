import { Locale } from '@/i18n-config';
import { getSites } from '@/lib/analytics';
import { toUnicode } from 'punycode';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const sites = await getSites();

  return (
    <div className='flex justify-center'>
      <ol className='list-decimal list-inside'>
        {sites.map(([name, count]) => (
          <li key={name}>
            <a
              className='btn-link leading-6 text-primary dark:text-secondary'
              href={`https://${name}`}
              target='_blank'
              rel='noreferrer'>
              {toUnicode(name)}
            </a>
            <div className='badge badge-xs'>{count.toLocaleString('zh-CN')}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
