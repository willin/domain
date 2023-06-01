'use client';
import { Locale } from '@/i18n-config';
import { useLoginInfo } from './use-login';
import { toUnicode } from 'punycode';
import Link from 'next/link';
import { translation } from '@/lib/i18n';

export function DomainList({ lang }: { lang: Locale }) {
  const t = translation(lang);
  const { records } = useLoginInfo();

  return (
    <>
      {records.map((record) => (
        <tr key={record.id}>
          <td>{record.type}</td>
          <td>{toUnicode(record.name)}</td>
          <td>{record.content}</td>
          <td>
            <Link className='link link-primary' href={`/${lang}/dashboard/edit/${record.id}`}>
              {t('common.edit')}
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
}
