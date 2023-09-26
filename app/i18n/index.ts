import { type RemixI18nOptions, RemixI18n } from 'remix-i18n';
import { dict as zh } from './zh';
import { dict as en } from './en';

export const config: RemixI18nOptions = {
  supportedLanguages: ['en', 'zh'],
  fallbackLng: 'zh'
};

export const languages = {
  zh: '简体中文',
  en: 'English'
};

export const i18n = new RemixI18n(config);

export function getLocale(pathname: string): string {
  const [, locale = ''] = pathname.split('/');
  if (i18n.supportedLanguages.includes(locale)) {
    return locale;
  }
  return i18n.fallbackLng;
}

i18n.set('zh', zh);
i18n.set('en', en);
