import { Locale } from '@/i18n-config';
import { getSites, totalDomains } from '@/lib/analytics';
import { toUnicode } from 'punycode';
import { translation } from '@/lib/i18n';
import SignInBtn from './signin';
import { FreeDomains } from '@/lib/config';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const [sites, counter] = await Promise.all([getSites(), totalDomains()]);
  const t = translation(lang);

  return (
    <div className='flex justify-center flex-col'>
      <div>
        <h2 className='mt-4 text-2xl'>{t('common.available')}</h2>
        <h3>
          ({t('common.total')}: <span className='badge badge-xs'>{(counter.total || 0).toLocaleString()}</span>)
        </h3>
        <ol className='list-disc list-inside my-4'>
          {FreeDomains.map((domain) => (
            <li key={domain}>
              {domain} <span className='badge badge-xs'>{(counter[domain] || 0).toLocaleString()}</span>
            </li>
          ))}
        </ol>
      </div>
      <SignInBtn label={t('common.login')} />
      <h2 className='my-4 text-2xl'>{t('common.rank')}</h2>
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
            <div className='badge badge-xs'>
              {count.toLocaleString()} {t('common.views')}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
