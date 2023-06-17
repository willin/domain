import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { CreateAndTitle } from './create';
import { DomainList } from './table';
import { MAX_LIMIT_FOLLOWER, MAX_LIMIT_USER, MAX_LIMIT_VIP } from '@/lib/config';

export const revalidate = 60;

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const t = translation(lang);

  return (
    <main>
      <CreateAndTitle lang={lang} />
      <section>
        <div className='overflow-x-auto w-full'>
          <table className='table table-zebra w-full min-w-full'>
            {/* head */}
            <thead>
              <tr>
                <th>{t('domain.type')}</th>
                <th>{t('domain.name')}</th>
                <th>{t('domain.content')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <DomainList lang={lang} />
            </tbody>
          </table>
        </div>
        <div>
          <h3 className='pt-4 text-info'>{t('common.limit_info')}</h3>
          <ul className='list-disc pl-4'>
            <li>
              {t('common.user')}: <span className='badge badge-primary'>{MAX_LIMIT_USER}</span>
            </li>
            <li>
              {t('common.follower')}: <span className='badge badge-secondary'>{MAX_LIMIT_FOLLOWER}</span>
              <a href='https://github.com/willin' target='_blank' className='btn btn-xs btn-secondary ml-2'>
                {t('common.follow')}
              </a>
            </li>
            <li>
              {t('common.vip')}: <span className='badge badge-accent'>{MAX_LIMIT_VIP}</span>
              <a
                target='_blank'
                className='btn btn-xs btn-accent ml-2'
                href={lang === 'zh' ? 'https://afdian.net/a/willin' : 'https://github.com/sponsors/willin'}>
                {t('common.donate')}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
