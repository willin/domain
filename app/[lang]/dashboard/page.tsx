import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { CreateAndTitle } from './create';

export const revalidate = 60;

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const t = translation(lang);

  return (
    <main>
      <CreateAndTitle lang={lang} records={0} />
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
              {/* {records.map((record) => (
                <></>
              ))} */}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
