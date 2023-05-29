import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ status: 0 }, { status: 401 });
  return NextResponse.json(session?.user);
}
