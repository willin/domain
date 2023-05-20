'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCRIPT = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059418763237956';

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
    // window.addEventListener('load', () => {
    //   // (A) TEST FETCH HEADER REQUEST TO GOOGLE ADSENSE
    //   const test = new Request(
    //     SCRIPT,
    //     // "https://static.ads-twitter.com/uwt.js",
    //     { method: 'HEAD', mode: 'no-cors' }
    //   );

    //   // (B) FIRE THE REQEST
    //   fetch(test)
    //     .then((res) => alert('ADS ALLOWED'))
    //     .catch((err) => alert('ADBLOCK DETECTED'));
    // });
  }, [pathname]);

  return (
    <>
      <Script async={true} src={SCRIPT} crossOrigin='anonymous' />
    </>
  );
}
