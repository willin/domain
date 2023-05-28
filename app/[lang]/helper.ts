import { Locale } from '@/i18n-config';

export type ContextParams = {
  params: { lang: Locale; [k: string]: string };
};
