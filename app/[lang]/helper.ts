import { Locale } from '@/i18n-config';

export type ContextParams = {
  params: { lang: Locale; [k: string]: string };
};

export interface iBalance {
  IN: number;
  OUT: number;
  BALANCE: number;
  date?: string;
  category?: string;
}

export function formatMoney(n: number) {
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
}
