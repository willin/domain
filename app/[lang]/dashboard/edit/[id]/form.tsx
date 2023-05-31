'use client';
import clsx from 'classnames';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { Locale } from '@/i18n-config';
import { useLoginInfo } from '../../use-login';
import { translation } from '@/lib/i18n';

export function UpdateForm({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const t = translation(lang);
  const { loading, maxDomains, records } = useLoginInfo();

  const remain = maxDomains - records.length || 0;
  if (loading || remain === 0) {
    return <></>;
  }

  return <form></form>;
}
