import { type RemixI18nOptions, RemixI18n } from 'remix-i18n';
import { dict as zh } from './zh';
import { dict as en } from './en';

export const i18nConfig: RemixI18nOptions = {
  supportedLanguages: ['en', 'zh'],
  fallbackLng: 'zh'
} as const;

export type Locale = (typeof i18nConfig)['supportedLanguages'][number];

export const languages = {
  zh: { name: '简体中文', flag: '🇨🇳', unicode: '1f1e8-1f1f3' },
  // 'zh-TW': { name: '正體中文', flag: '🇹🇼', unicode: '1f1f9-1f1fc' },
  en: { name: 'English', flag: '🇺🇸', unicode: '1f1fa-1f1f8' }
  // ko: { name: '한국어', flag: '🇰🇷', unicode: '1f1f0-1f1f7' },
  // ja: { name: '日本語', flag: '🇯🇵', unicode: '1f1ef-1f1f5' }
} as const;

export const i18n = new RemixI18n(i18nConfig);

export function getLocale(pathname: string): string {
  const [, locale = ''] = pathname.split('/');
  if (i18n.supportedLanguages.includes(locale)) {
    return locale;
  }
  return i18n.fallbackLng;
}

i18n.set('zh', zh);
i18n.set('en', en);
