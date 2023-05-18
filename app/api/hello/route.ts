import { KVNamespace } from '@cloudflare/workers-types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { DOMAINS } = process.env as any as { DOMAINS: KVNamespace };
  await DOMAINS?.put('test', 'value');

  const data = await DOMAINS?.get('test');
  return NextResponse.json({ data });
}
