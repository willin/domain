'use client';
import clsx from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Locale } from '@/i18n-config';

export function BottomNav({ lang }: { lang: Locale }) {
  const params = useParams();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return (
    <div className='btm-nav text-primary text-sm z-50'>
      <Link
        href={`/${lang}/${year}`}
        className={clsx({
          active: params.year && !params.month && !params.day,
          'text-primary-focus': params.year && !params.month && !params.day
        })}>
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 stroke-current fill-none' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>

        <span className='btm-nav-label'>年视图</span>
      </Link>
      <Link
        href={`/${lang}/${year}/${month}`}
        className={clsx({
          active: params.month && !params.day,
          'text-primary-focus': params.month && !params.day
        })}>
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 fill-current' viewBox='0 0 16 16'>
          <path d='M2.56 11.332L3.1 9.73h1.984l.54 1.602h.718L4.444 6h-.696L1.85 11.332h.71zm1.544-4.527L4.9 9.18H3.284l.8-2.375h.02zm5.746.422h-.676V9.77c0 .652-.414 1.023-1.004 1.023-.539 0-.98-.246-.98-1.012V7.227h-.676v2.746c0 .941.606 1.425 1.453 1.425.656 0 1.043-.28 1.188-.605h.027v.539h.668V7.227zm2.258 5.046c-.563 0-.91-.304-.985-.636h-.687c.094.683.625 1.199 1.668 1.199.93 0 1.746-.527 1.746-1.578V7.227h-.649v.578h-.019c-.191-.348-.637-.64-1.195-.64-.965 0-1.64.679-1.64 1.886v.34c0 1.23.683 1.902 1.64 1.902.558 0 1.008-.293 1.172-.648h.02v.605c0 .645-.423 1.023-1.071 1.023zm.008-4.53c.648 0 1.062.527 1.062 1.359v.253c0 .848-.39 1.364-1.062 1.364-.692 0-1.098-.512-1.098-1.364v-.253c0-.868.406-1.36 1.098-1.36z' />
          <path d='M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z' />
        </svg>
        <span className='btm-nav-label'>月视图</span>
      </Link>
      <Link
        href={`/${lang}/${year}/${month}/${day}`}
        className={clsx({
          active: params.day,
          'text-primary-focus': params.day
        })}>
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 fill-current' viewBox='0 0 16 16'>
          <path d='M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4v5.332h.684zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 00-.254-.02c-.582 0-.891.32-1.012.567h-.02v-.504H7.98v4.105zm2.805-5.093c0 .238.192.425.43.425a.428.428 0 100-.855.426.426 0 00-.43.43zm.094 5.093h.672V7.418h-.672v4.105z' />
          <path d='M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z' />
        </svg>
        <span className='btm-nav-label'>日视图</span>
      </Link>
    </div>
  );
}
