import './globals.css';
import { i18n } from '@/i18n-config';
import { BackgroundImage } from './background';
import { MainHeader } from './header';
import { ContextParams } from './helper';
import { Metadata } from 'next';
import { BaseURL } from '@/lib/config';
// import { BottomNav } from './bottom';
import { Bootstrap } from './bootstrap';

export const metadata: Metadata = {
  title: {
    default: 'Willin Wang 长岛冰泪',
    template: '%s | Willin Wang 长岛冰泪'
  },
  description: '不走老路。 To be Willin is to be willing.',
  keywords: ['Next.js', 'React', 'JavaScript', 'Willin Wang'],
  authors: [{ name: 'Willin Wang', url: 'https://willin.wang' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico'
  },
  appleWebApp: {
    capable: true,
    title: '$Willin$',
    statusBarStyle: 'black-translucent'
  },
  appLinks: {
    web: {
      url: BaseURL,
      should_fallback: true
    }
  },
  alternates: {
    canonical: BaseURL,
    languages: {
      'en-US': `${BaseURL}/en`,
      'zh-CN': `${BaseURL}/zh`
    }
  }
};

export default function RootLayout({ children, params }: { children: React.ReactNode } & ContextParams) {
  return (
    <html lang={params.lang}>
      <head />
      <body>
        <BackgroundImage />
        <MainHeader />
        <div className='container mx-auto shadow bg-base-100/70 p-2 sm:p-4 mb-20'>
          {children}
          <footer className='text-center text-sm'>
            &copy; <a href='https://willin.wang'>Willin Wang</a>
          </footer>
        </div>

        {/* <BottomNav lang={params.lang} /> */}
        <Bootstrap />
      </body>
    </html>
  );
}

export const revalidate = 3600;
export const runtime = 'edge';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
