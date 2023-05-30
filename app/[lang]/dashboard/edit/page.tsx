import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const t = translation(lang);
  return (
    <div>
      <h2 className='text-primary text-2xl'>{t('common.edit')}</h2>
    </div>
  );
}
