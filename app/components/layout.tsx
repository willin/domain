import { type ReactNode } from 'react';
import BackgroundImage from './background';
import Bootstrap from './bootstrap';
import MainHeader from './header';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <BackgroundImage />
      <MainHeader />
      <main className='w-[640px] max-w-full mx-auto shadow bg-base-100/70 p-2 sm:p-4 mb-20'>
        <article className='prose'>{children}</article>
        <Bootstrap />
        <footer className='text-center text-sm mt-4'>
          <p>
            <a
              href='https://github.com/willin'
              target='_blank'
              className='inline-block'>
              <img
                src='https://img.shields.io/github/followers/willin.svg?style=social&amp;label=Followers'
                alt='Github Followers'
              />
            </a>{' '}
            <a
              href='https://github.com/willin/domain'
              target='_blank'
              className='inline-block'>
              <img
                alt='GitHub Repo stars'
                src='https://img.shields.io/github/stars/willin/domain?style=social'
              />
            </a>
          </p>
          <p>
            &copy;{' '}
            <a href='https://willin.wang' target='_blank'>
              Willin Wang
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
