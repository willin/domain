import dlv from 'dlv';
import tmpl from 'templite';
import type { Locale } from '../i18n-config';
import en from '../i18n/en.json';
import zh from '../i18n/zh.json';
// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en,
  zh
};

// eslint-disable-next-line no-unused-vars
export type Translator = (key: string, params?: any) => string;

export const translation = (locale: Locale) => {
  const dict = dictionaries[locale];
  const t: Translator = (key, params) => {
    // eslint-disable-next-line
    const val = dlv(dict as any, key, key);
    // eslint-disable-next-line
    if (typeof val === 'function') return val(params) as string;
    // eslint-disable-next-line
    if (typeof val === 'string') return tmpl(val, params);
    return val as string;
  };
  return t;
};
