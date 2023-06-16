'use server';

import { FreeDomainsMapping } from '@/lib/config';
import { CFResult, addPendingDomain, checkDomain, deleteDomain, domainRecord, editDomain } from '@/lib/dns';

export async function checkDomainAction(params: { name: string; zone_name: string }) {
  const { zone_name, name } = params;
  const result = await checkDomain({
    zoneId: FreeDomainsMapping[zone_name],
    name,
    domain: zone_name
  });
  return result;
}

export async function createDomainAction(params: CFResult['result']) {
  const { zone_name, name, content, type, proxied, username, purpose } = params;
  return addPendingDomain({
    zoneId: FreeDomainsMapping?.[zone_name],
    name,
    content,
    type,
    proxied,
    username,
    purpose
  });
}

export async function updateDomainAction(params: CFResult['result']) {
  const { id = '', zone_name, name, content, type, proxied, username } = params;
  const result = await editDomain({
    id,
    zoneId: FreeDomainsMapping?.[zone_name],
    name: name?.split('.')?.[0],
    content,
    type,
    proxied,
    username
  });
  return result;
}

export async function deleteDomainAction(params: CFResult['result']) {
  const { id = '', zone_name, username } = params;
  const result = await deleteDomain({
    id,
    zoneId: FreeDomainsMapping[zone_name],
    username
  });
  return result;
}

export async function adminDomainOperation(params: CFResult['result'], approve = false) {
  if (approve) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await editDomain(params as any);
  }
  await domainRecord({ username: '$$pending', type: 'DELETE', record: params as any });
}
