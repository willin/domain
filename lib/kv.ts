import CloudflareKV from 'remote-cloudflare-kv';
import { CFAccountId, CFApiToken, CFNamespaceId } from './config';

export const NAMESPACE = new CloudflareKV({
  account_id: CFAccountId,
  namespace_id: CFNamespaceId,
  // use bearer token
  api_token: CFApiToken
});

export default NAMESPACE;
