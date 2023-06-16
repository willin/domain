import { Locale } from '@/i18n-config';
import { getUserRecords } from '@/lib/dns';
import { translation } from '@/lib/i18n';
import { toUnicode } from 'punycode';
import { ApproveDomain, DeclineDomain } from './client';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const records = await getUserRecords({ username: '$$pending' });
  const t = translation(lang);

  return (
    <main>
      <section>
        <div className='overflow-x-auto w-full'>
          <table className='table table-zebra w-full min-w-full'>
            {/* head */}
            <thead>
              <tr>
                <th>{t('domain.type')}</th>
                <th>{t('domain.name')}</th>
                <th>{t('domain.content')}</th>
                <th>{t('domain.purpose')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.name}>
                  <td>{record.type}</td>
                  <td>
                    {record.name.includes('.')
                      ? toUnicode(record.name)
                      : toUnicode(`${record.name}.${record.zone_name}`)}
                  </td>
                  <td>{record.content}</td>
                  <td>{record.purpose}</td>
                  <td>
                    <ApproveDomain record={record} label={t('domain.approve')} />{' '}
                    <DeclineDomain record={record} label={t('domain.decline')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
