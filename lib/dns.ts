import 'server-only';
import { toASCII } from 'punycode';
import { cache } from 'react';
import { CFApiToken, BlockedList } from './config';

export type CFResult = {
  success: boolean;
  result: {
    id: string;
  };
};

const ApiEndpoint = (zoneId: string) => `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

export const checkDomain = cache(
  async (params: { zoneId: string; name: string; domain: string; isAdmin?: boolean }) => {
    const { zoneId, domain, name, isAdmin = false } = params;
    if (!isAdmin && BlockedList.includes(name)) return false;
    const response = await fetch(`${ApiEndpoint(zoneId)}?name=${toASCII(`${name}.${domain}`)}`, {
      headers: {
        Authorization: `Bearer ${CFApiToken}`
      }
    });

    const { result }: { result: { id: string }[] } = await response.json();

    return result?.length === 0;
  }
);

export const editDomain = async (params: {
  id?: string;
  zoneId: string;
  name: string;
  content: string;
  type: string;
  proxied?: boolean;
  username?: string;
}): Promise<string> => {
  const { id, zoneId, name, content, type, username = '', proxied = false } = params;

  const res = await fetch(`${ApiEndpoint(zoneId)}${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    headers: {
      Authorization: `Bearer ${CFApiToken}`
    },
    body: JSON.stringify({
      name: toASCII(name),
      content,
      comment: username,
      type,
      proxied,
      ttl: 1
    })
  });
  const data = (await res.json()) as CFResult;

  if (data.success) {
    return data?.result?.id || '';
  }
  return '';
};

export const deleteDomain = async (params: { id: string; zoneId: string }): Promise<boolean> => {
  const { id, zoneId } = params;
  const res = await fetch(`${ApiEndpoint(zoneId)}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${CFApiToken}`
    }
  });
  const data = (await res.json()) as CFResult;
  return !!data.result.id;
};
