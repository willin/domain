export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh']
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const languages = {
  zh: { name: '简体中文', flag: '🇨🇳', unicode: '1f1e8-1f1f3' },
  // 'zh-TW': { name: '正體中文', flag: '🇹🇼', unicode: '1f1f9-1f1fc' },
  en: { name: 'English', flag: '🇺🇸', unicode: '1f1fa-1f1f8' }
  // ko: { name: '한국어', flag: '🇰🇷', unicode: '1f1f0-1f1f7' },
  // ja: { name: '日本語', flag: '🇯🇵', unicode: '1f1ef-1f1f5' }
};
