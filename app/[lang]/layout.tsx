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
        <div className='w-[640px] max-w-full mx-auto shadow bg-base-100/70 p-2 sm:p-4 mb-20'>
          {children}
          <footer className='text-center text-sm mt-4'>
            <p>
              <a href='https://github.com/willin' target='_blank' className='inline-block'>
                <img
                  src='https://img.shields.io/github/followers/willin.svg?style=social&amp;label=Followers'
                  alt='Github Followers'
                />
              </a>{' '}
              <a href='https://github.com/willin/domain' target='_blank' className='inline-block'>
                <img alt='GitHub Repo stars' src='https://img.shields.io/github/stars/willin/domain?style=social' />
              </a>
            </p>
            <p>
              &copy;{' '}
              <a href='https://willin.wang' target='_blank'>
                Willin Wang
              </a>
            </p>
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
