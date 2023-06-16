'use client';
import clsx from 'classnames';
import { useTransition } from 'react';
import { CFResult } from '@/lib/dns';
import { adminDomainOperation } from '../actions';
import { useRouter } from 'next/navigation';

export function ApproveDomain({ record, label }: { record: CFResult['result']; label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={clsx('btn btn-xs btn-success', {
        'btn-disabled': isPending
      })}
      onClick={() =>
        startTransition(() =>
          adminDomainOperation(record, true).then(() => {
            router.refresh();
          })
        )
      }>
      {label}
    </button>
  );
}

export function DeclineDomain({ record, label }: { record: CFResult['result']; label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={clsx('btn btn-xs btn-error', {
        'btn-disabled': isPending
      })}
      onClick={() =>
        startTransition(() =>
          adminDomainOperation(record, false).then(() => {
            router.refresh();
          })
        )
      }>
      {label}
    </button>
  );
}
