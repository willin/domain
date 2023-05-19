import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/next-auth';
import { Auth } from '@auth/core';

export async function checkAuth(request: Request) {
  // Session Check
  const session = await Auth(request, authOptions);
  if (!session) return NextResponse.json({ status: 0 }, { status: 401 });
}

export function defaultHandler() {
  return NextResponse.json({ status: 404 }, { status: 404 });
}

export function catchServerError<T = any>(defaultValue: T) {
  return (e: Error) => {
    console.error(e);
    return defaultValue;
  };
}

export type ApiContextParams = { params: { [k: string]: string } };
