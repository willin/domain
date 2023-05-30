'use client';
import clsx from 'classnames';
import Link from 'next/link';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { useLoginInfo } from './use-login';

export function CreateAndTitle({ lang, records }: { lang: Locale; records: number }) {
  const t = translation(lang);
  const { loading, maxDomains } = useLoginInfo();
  const remain = maxDomains - records || 0;
  return (
    <>
      <nav className='flex justify-end'>
        <Link
          className={clsx('btn btn-primary', {
            'btn-disabled': loading || remain === 0
          })}
          href={`/${lang}/dashboard/create`}>
          {t('common.create')}
        </Link>
      </nav>
      <h2 className='my-4 text-2xl text-secondary'>{t('common.mine', { available: remain.toLocaleString() })}</h2>
    </>
  );
}
