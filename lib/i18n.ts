import 'server-only';
import dlv from 'dlv';
import tmpl from 'templite';
import type { Locale } from '../i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('../i18n/en.json').then((module) => module.default),
  zh: () => import('../i18n/zh.json').then((module) => module.default)
};

// eslint-disable-next-line no-unused-vars
export type Translator = (key: string, params?: any) => string;

export const translation = async (locale: Locale) => {
  const dict = await dictionaries[locale]();
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
