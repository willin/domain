'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Bootstrap() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      // @ts-ignore
      // eslint-disable-next-line
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      //
    }
  }, [pathname]);

  return (
    <>
      <Script
        async={true}
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059418763237956'
        crossOrigin='anonymous'
      />
    </>
  );
}
