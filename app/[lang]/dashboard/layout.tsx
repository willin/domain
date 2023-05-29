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
    return (
      <Error lang={lang} goBack={t('common.go_back')} forbidden={t('common.forbidden')} login={t('common.login')} />
    );
  }
  return (
    <>
      {children}
      <Logout />
    </>
  );
}
