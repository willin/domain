import 'server-only';
import { toASCII } from 'punycode';
import { CFApiToken, BlockedList, FreeDomainsConfig, DNSType } from './config';
import { totalDomains } from './analytics';
import kv from './kv';

export type CFResult = {
  success: boolean;
  result: {
    id: string;
    name: string;
    content: string;
    type: string;
    comment: string;
    zone_id: string;
    zone_name: string;
    ttl: number;
    proxied: boolean;
    priority: number;
    // custom
    username?: string;
    pending?: boolean;
    purpose?: string;
  };
};

const ApiEndpoint = (zoneId: string) => `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

export const domainCounter = async (params: { zoneId: string; count?: number }) => {
  const { zoneId, count = 1 } = params;
  const [domain] = FreeDomainsConfig.find(([, zid]) => zid === zoneId) || [];
  const result = await totalDomains();
  if (domain) {
    result[domain] = count + (result[domain] || 0);
    result.total += count;
  }
  await kv.put('$$total', JSON.stringify(result));
};

export const domainRecord = async (params: {
  username: string;
  type: 'ADD' | 'EDIT' | 'DELETE' | 'PENDING';
  record: CFResult['result'];
}) => {
  const { username, type, record } = params;
  const data = await getUserRecords({ username });
  switch (type) {
    case 'DELETE': {
      if (username === '$$pending') {
        const index = data.findIndex((r) => r.name === record.name && r.zone_name === record.zone_name);
        if (index !== -1) {
          data.splice(index, 1);
        }
      } else {
        const index = data.findIndex((r) => r.id === record.id);
        if (index !== -1) {
          data.splice(index, 1);
        }
      }

      break;
    }
    case 'EDIT': {
      const index = data.findIndex((r) => r.id === record.id);

      if (index !== -1) {
        data[index] = record;
      }
      break;
    }
    case 'PENDING': {
      record.pending = true;
      const { zoneId } = record as any as { zoneId: string };
      const zone_name = FreeDomainsConfig.find(([, zid]) => zid === zoneId)?.[0];
      if (zone_name) record.zone_name = zone_name;
      data.push(record);
      break;
    }
    case 'ADD': {
      const index = data.findIndex((r) => `${r.name}.${r.zone_name}` === record.name && r.pending);
      if (index !== -1) {
        data[index] = record;
      }
      break;
    }
    // eslint-disable-next-line no-fallthrough
    default: {
      data.push(record);
    }
  }
  await kv.put(username, JSON.stringify(data));
};

export const checkDomain = async (params: { zoneId: string; name: string; domain: string; isAdmin?: boolean }) => {
  const { zoneId, domain, name, isAdmin = false } = params;
  if (!isAdmin && BlockedList.includes(name)) return false;
  if (name.includes('.') || ['@', '*', '.'].includes(name)) return false;
  const response = await fetch(`${ApiEndpoint(zoneId)}?name=${toASCII(`${name}.${domain}`)}`, {
    headers: {
      Authorization: `Bearer ${CFApiToken}`
    }
  });

  const { result }: { result: { id: string }[] } = await response.json();

  return result?.length === 0;
};

export const addPendingDomain = async (params: {
  zoneId: string;
  name: string;
  content: string;
  type: string;
  proxied?: boolean;
  username?: string;
  priority?: number;
  purpose?: string;
}) => {
  await domainRecord({ username: params.username!, type: 'PENDING', record: params as any });
  await domainRecord({ username: '$$pending', type: 'PENDING', record: params as any });
};

export const approvePendingDomain = async (params: { id: string }) => {
  const data = await getUserRecords({ username: '$$pending' });
  const record = data.find((r) => r.id === params.id);
  if (!record) return false;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = await editDomain(record as any);
  await domainRecord({
    username: '$$pending',
    type: 'DELETE',
    record
  });
  return result;
};

export const editDomain = async (params: {
  id?: string;
  zoneId: string;
  name: string;
  content: string;
  type: string;
  proxied?: boolean;
  username?: string;
  priority?: number;
}): Promise<CFResult['result'] | null> => {
  const { id, zoneId, name, content, type, username = '', proxied = false, priority = 10 } = params;
  if (!id && !DNSType.includes(type)) {
    return null;
  }
  const form: Record<string, unknown> = {
    name: toASCII(name),
    content,
    comment: username,
    type,
    ttl: 1
  };
  if (type !== 'MX' && type !== 'TXT') {
    form.proxied = proxied;
  }
  if (type === 'MX') {
    form.priority = priority;
  }

  const data: CFResult = await fetch(`${ApiEndpoint(zoneId)}${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    headers: {
      Authorization: `Bearer ${CFApiToken}`
    },
    body: JSON.stringify(form)
  })
    .then((res) => res.json())
    .catch(() => ({}));

  if (data.success) {
    if (!id) {
      await domainCounter({ zoneId });
    }
    if (username) {
      await domainRecord({ username, type: id ? 'EDIT' : 'ADD', record: data.result });
    }
    return data.result;
  }
  return null;
};

export const deleteDomain = async (params: { id: string; zoneId: string; username?: string }): Promise<boolean> => {
  const { id, zoneId, username = '' } = params;
  const data: CFResult = await fetch(`${ApiEndpoint(zoneId)}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${CFApiToken}`
    }
  })
    .then((res) => res.json())
    .catch(() => ({}));
  const success = !!data.result?.id;
  if (success) {
    //   // count -1
    //   await domainCounter({ zoneId, count: -1 });
    if (username) {
      await domainRecord({ username, type: 'DELETE', record: data.result });
    }
  }
  return success;
};

export const getUserRecords = async (params: { username: string }) => {
  const result = await kv.get<CFResult['result'][]>(params.username, 'json');
  return result || [];
};
