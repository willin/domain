import { BlockedList, DNSType } from '~/config';
import { toASCII } from '~/helpers/punycode';

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
    proxiable: boolean;
    priority: number;
  };
};

export interface ICloudflareDNSProvider {
  checkDomain(params: {
    zone_id: string;
    name: string;
    domain: string;
    isAdmin?: boolean;
  }): Promise<boolean>;
  editDomain(params: {
    id?: string;
    zone_id: string;
    name: string;
    content: string;
    type: string;
    proxiable?: boolean;
    username?: string;
    priority?: number;
  }): Promise<CFResult['result'] | null>;
  deleteDomain(params: { id: string; zone_id: string }): Promise<boolean>;
}

const ApiEndpoint = (zone_id: string) =>
  `https://api.cloudflare.com/client/v4/zones/${zone_id}/dns_records`;

export class CloudflareDNSProvider implements ICloudflareDNSProvider {
  #ApiToken: string;

  constructor(env: RemixServer.Env) {
    this.#ApiToken = env.CF_API_TOKEN;
  }

  public async checkDomain(
    params: Parameters<ICloudflareDNSProvider['checkDomain']>[0]
  ) {
    const { zone_id, domain, name, isAdmin = false } = params;
    if (!isAdmin && BlockedList.includes(name)) return false;
    if (name.includes('.') || ['@', '*', '.'].includes(name)) return false;
    const response = await fetch(
      `${ApiEndpoint(zone_id)}?name=${toASCII(`${name}.${domain}`)}`,
      {
        headers: {
          Authorization: `Bearer ${this.#ApiToken}`
        }
      }
    );

    const { result }: { result: { id: string }[] } = await response.json();

    return result?.length === 0;
  }

  public async editDomain(
    params: Parameters<ICloudflareDNSProvider['editDomain']>[0]
  ) {
    const {
      id,
      zone_id,
      name,
      content,
      type,
      username = '',
      proxiable = false,
      priority = 10
    } = params;
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
      form.proxiable = !!proxiable;
    }
    if (type === 'MX') {
      form.priority = priority;
    }
    const data: CFResult = await fetch(
      `${ApiEndpoint(zone_id)}${id ? `/${id}` : ''}`,
      {
        method: id ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${this.#ApiToken}`
        },
        body: JSON.stringify(form)
      }
    )
      .then((res) => res.json())
      .catch(() => ({}));

    if (data.success) {
      return data.result;
    }
    return null;
  }

  public async deleteDomain(
    params: Parameters<ICloudflareDNSProvider['deleteDomain']>[0]
  ) {
    const { id, zone_id } = params;
    const data: CFResult = await fetch(`${ApiEndpoint(zone_id)}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.#ApiToken}`
      }
    })
      .then((res) => res.json())
      .catch(() => ({}));
    const success = !!data.result?.id;
    return success;
  }
}
