// import { LocaleLink } from '@/ui/locale-link';
// import { LanguageChange } from './languages';
// import { PageLinks } from './page-links';

import Link from 'next/link';
import { ThemeChange } from './themes';
import { LanguageChange } from './languages';

export function MainHeader() {
  return (
    <header className='sticky top-0 flex justify-center w-full z-20 opacity-90 hover:opacity-100 bg-base-100 mb-4'>
      <div className='w-full max-w-screen-2xl navbar'>
        <div className='navbar-start'>
          <div className='flex-1 px-2 mx-2 font-bold'>
            <Link href='/'>Willin Wang</Link>
          </div>
        </div>
        {/* <div className='navbar-center'>
          <div className='flex-none hidden lg:block'>
            <PageLinks className='menu menu-horizontal' locale={locale} />
          </div>
        </div> */}
        <div className='navbar-end'>
          <LanguageChange />
          <ThemeChange />
        </div>
      </div>
    </header>
  );
}
