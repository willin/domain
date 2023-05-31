'use server';

export async function checkDomainAction(params: { name: string; zone_name: string }) {
  console.log(params);
  return true;
}
