import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useI18n } from 'remix-i18n';

const SCRIPT =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059418763237956';

export default function Bootstrap() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    try {
      // @ts-ignore
      // eslint-disable-next-line
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      //
    }
    // Ignore core pages
    if (
      ['/', '/zh', '/en'].includes(pathname) ||
      window.location.hostname === 'localhost'
    )
      return;
    // (A) TEST FETCH HEADER REQUEST TO GOOGLE ADSENSE
    const test = new Request(SCRIPT, { method: 'HEAD', mode: 'no-cors' });
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
          setBlocked(true);
          const sponsor = document.querySelector('article.prose');
          sponsor?.remove();
        } else {
          setBlocked(false);
        }
      });
  }, [pathname]);

  return (
    <>
      <script async={true} src={SCRIPT} crossOrigin='anonymous' />
      {blocked && (
        <article>
          <h1>{t('common.adblock')}</h1>
          <p>{t('common.adblock_message')}</p>
        </article>
      )}
    </>
  );
}
