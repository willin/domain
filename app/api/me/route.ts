import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth/next';
import { getUserRecords } from '@/lib/dns';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ username: '' });
  const records = await getUserRecords({ username: session?.user.username });
  return NextResponse.json({ ...session?.user, records });
}
