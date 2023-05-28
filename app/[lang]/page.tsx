import { Locale } from '@/i18n-config';
import { getSites } from '@/lib/analytics';
import { toUnicode } from 'punycode';
import { translation } from '@/lib/i18n';
import SignInBtn from './signin';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const sites = await getSites();
  const t = translation(lang);

  return (
    <div className='flex justify-center flex-col'>
      <SignInBtn label={t('common.login')} />
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
