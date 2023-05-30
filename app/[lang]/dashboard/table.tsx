'use client';
import { Locale } from '@/i18n-config';
import { useLoginInfo } from './use-login';

export function DomainList({ lang }: { lang: Locale }) {
  const { records } = useLoginInfo();

  return (
    <>
      {records.map((record) => (
        <tr key={record.id}>
          <td>test</td>
        </tr>
      ))}
    </>
  );
}
