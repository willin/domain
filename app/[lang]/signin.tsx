'use client';
import { signIn } from '@auth/nextjs/client';

export default function SignInBtn({ label }: { label: string }) {
  return (
    <button className='btn glass mb-4 text-primary' onClick={() => signIn('github')}>
      {label}
    </button>
  );
}
