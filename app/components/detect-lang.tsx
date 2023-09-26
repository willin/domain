import { useLocation } from '@remix-run/react';
import { useEffect } from 'react';
import { useI18n } from 'remix-i18n';
import { getLocale } from '~/i18n';

export default function DetectLanguage() {
  const location = useLocation();
  const i18n = useI18n();

  useEffect(() => {
    const locale = getLocale(location.pathname);
    if (locale !== i18n.locale()) {
      i18n.locale(locale);
    }
  }, [location]);
}
