'use client';
import { Locale } from '@/i18n-config';
import Error from './error';
import { useLoginInfo } from './use-login';

export function MainContainer({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const { loading, username } = useLoginInfo();
  if (loading) return <main></main>;
  if (!loading && !username) {
    return <Error lang={lang} />;
  }
  return <main>{children}</main>;
}
