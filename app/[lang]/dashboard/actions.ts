'use server';

import { FreeDomainsMapping } from '@/lib/config';
import { CFResult, addPendingDomain, checkDomain, deleteDomain, editDomain } from '@/lib/dns';

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
