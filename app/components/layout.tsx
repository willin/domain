import { type ReactNode } from 'react';
import BackgroundImage from './background';
import Bootstrap from './bootstrap';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <BackgroundImage />
      <main className='w-[640px] max-w-full mx-auto shadow bg-base-100/70 p-2 sm:p-4 mb-20'>
        <article className='prose'>{children}</article>
        <Bootstrap />
      </main>
    </>
  );
}
