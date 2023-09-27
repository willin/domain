import { useLocation } from '@remix-run/react';
import { useEffect } from 'react';
import { useI18n } from 'remix-i18n';
import { getLocale } from '~/i18n';

export default function DetectLanguage() {
  const { pathname } = useLocation();
  const i18n = useI18n();

  useEffect(() => {
    const locale = getLocale(pathname);
    if (locale !== i18n.locale()) {
      i18n.locale(locale);
    }
    try {
      // @ts-ignore
      // eslint-disable-next-line
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      //
    }
  }, [pathname, i18n]);
}
