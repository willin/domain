import Link from 'next/link';
import { ThemeChange } from './themes';
import { LanguageChange } from './languages';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';

export function MainHeader({ lang }: { lang: Locale }) {
  const t = translation(lang);

  return (
    <header className='sticky top-0 flex justify-center w-full z-20 opacity-90 hover:opacity-100 bg-base-100 mb-4'>
      <div className='navbar bg-base-100'>
        <div className='navbar-start'>
          <Link href={`/${lang}`} className='btn btn-ghost normal-case text-xl'>
            Willin Domains
          </Link>
        </div>
        <div className='navbar-end'>
          <LanguageChange />
          <ThemeChange />
        </div>
      </div>
    </header>
  );
}
