import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';
import { translation } from '@/lib/i18n';
import { Locale } from '@/i18n-config';
import Error from './error';
import { Logout } from './logout';

export default async function AdminLayout({
  params: { lang },
  children
}: {
  params: { lang: Locale };
  children: React.ReactNode;
}) {
  const t = translation(lang);
  const session = await getServerSession(authOptions);
  if (!session) {
    return <Error lang={lang} />;
  }
  return (
    <main>
      <div className='ads mx-auto text-center mb-4'>
        <ins
          className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client='ca-pub-5059418763237956'
          data-ad-slot='9518721243'
          data-ad-format='auto'
          data-full-width-responsive='true'></ins>
      </div>
      <article className='prose'>{children}</article>
      <Logout label={t('common.logout')} />
    </main>
  );
}
