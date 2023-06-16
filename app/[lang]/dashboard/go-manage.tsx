'use client';
import Link from 'next/link';
import { useLoginInfo } from './use-login';

export function GoManage() {
  const { admin } = useLoginInfo();
  if (!admin) return <></>;
  return (
    <div className='tooltip mr-4' data-tip={'Manage'}>
      <Link href={`/dashboard/admin`} className='btn btn-circle'>
        <svg className='fill-current' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 512 512'>
          <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
        </svg>
      </Link>
    </div>
  );
}
