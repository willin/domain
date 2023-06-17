import { translation } from '@/lib/i18n';
import { Locale } from '@/i18n-config';
import { Logout } from './logout';
import { MainContainer } from './container';
import { GoBack } from './go-back';
import { GoManage } from './go-manage';

export default async function AdminLayout({
  params: { lang },
  children
}: {
  params: { lang: Locale };
  children: React.ReactNode;
}) {
  const t = translation(lang);

  return (
    <MainContainer lang={lang}>
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
      <div className='text-center py-4'>
        <GoBack label={t('common.go_back')} />
        <GoManage />
        <Logout label={t('common.logout')} />
      </div>
    </MainContainer>
  );
}
