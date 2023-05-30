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
    // Ignore core pages
    if (pathname === '/zh' || pathname === '/en') return;
    // (A) TEST FETCH HEADER REQUEST TO GOOGLE ADSENSE
    const test = new Request(
      SCRIPT,
      // "https://static.ads-twitter.com/uwt.js",
      { method: 'HEAD', mode: 'no-cors' }
    );

    // (B) FIRE THE REQEST
    let result: boolean;
    fetch(test)
      .then(() => (result = true))
      .catch(() => (result = false))
      .finally(() => {
        const elm = document.querySelector('ins.adsbygoogle');
        if (
          !result ||
          // @ts-ignore
          (elm && window.getComputedStyle(elm).display === 'none') ||
          // @ts-ignore
          (elm && window.getComputedStyle(elm.parentElement).display === 'none')
        ) {
          // 删除文章正文
          const sponsor = document.querySelector('article.prose');
          if (!sponsor) return;
          const prompt = document.createElement('div');
          // @ts-ignore
          prompt.style =
            'border: 1px solid #c6c6c6;border-radius: 4px;background-color: #f5f2f0;padding: 15px; margin:10px 0; font-size: 2rem;';
          prompt.innerHTML =
            '<p>您使用了广告拦截器，导致本站内容无法显示。</p><p>请将 willin.wang 加入白名单，解除广告屏蔽后，刷新页面。谢谢。</p>';
          prompt.innerHTML +=
            '<hr style="margin: 5px 0" /><p>Adblock Detected</p><p>Please set willin.wang to the unblocked list, and refresh the page, thanks.</p>';
          // @ts-ignore
          sponsor.parentNode.replaceChild(prompt, sponsor);
        }
      });
  }, [pathname]);

  return (
    <>
      <Script async={true} src={SCRIPT} crossOrigin='anonymous' />
    </>
  );
}
