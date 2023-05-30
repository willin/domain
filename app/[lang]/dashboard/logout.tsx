'use client';
import { signOut } from 'next-auth/react';

export function Logout({ label }: { label: string }) {
  return (
    <div className='text-center py-4'>
      <div className='tooltip' data-tip={label}>
        <button className='btn btn-circle' onClick={() => signOut({ callbackUrl: '/' })}>
          <svg className='fill-current' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 512 512'>
            <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
          </svg>
        </button>
      </div>
    </div>
  );
}
