'use client';
import { signIn } from 'next-auth/react';

export default function SignInBtn({ label }: { label: string }) {
  return (
    <button className='btn glass mb-4 text-primary' onClick={() => signIn('github', { callbackUrl: '/dashboard' })}>
      {label}
    </button>
  );
}
