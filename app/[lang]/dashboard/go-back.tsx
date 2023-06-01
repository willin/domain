'use client';
import { usePathname, useRouter } from 'next/navigation';

export function GoBack({ label }: { label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname.endsWith('/dashboard')) return null;

  return (
    <div className='tooltip mr-4' data-tip={label}>
      <button className='btn btn-circle' onClick={() => router.back()}>
        <svg viewBox='0 0 512 512' className='fill-current' xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={48}
            d='M244 400L100 256l144-144M120 256h292'
          />
        </svg>
      </button>
    </div>
  );
}
