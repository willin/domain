import clsx from 'classnames';
import Link from 'next/link';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';

export const revalidate = 60;

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const t = translation(lang);

  return (
    <div>
      <h2>test</h2>
    </div>
  );
}
