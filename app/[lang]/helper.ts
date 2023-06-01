import { Locale } from '@/i18n-config';
import { FreeDomains } from '@/lib/config';
import { validateDomain, validateIpv4, validateIpv6 } from '@/lib/utils';

export type ContextParams = {
  params: { lang: Locale; [k: string]: string };
};

export type FormParams = {
  name: { value: string };
  zone_name: { value: string };
  type: { value: keyof typeof FreeDomains };
  content: { value: string };
  proxied: { checked: boolean };
};

export function getPlaceHolder(type: string) {
  switch (type) {
    case 'A': {
      return '1.2.3.4';
    }
    case 'AAAA': {
      return '2001:4860:4860::8888';
    }
    case 'CNAME': {
      return 'willin.github.io';
    }
    case 'NS': {
      return 'ns1.example.com';
    }
    case 'MX': {
      return 'mx1.example.com';
    }
    default: {
      return '';
    }
  }
}

export function validateContent(t: string, c: string) {
  switch (t) {
    case 'A': {
      return validateIpv4(c);
    }
    case 'AAAA': {
      return validateIpv6(c);
    }
    case 'CNAME': {
      return validateDomain(c);
    }
    case 'MX':
    case 'NS': {
      return validateDomain(c) || validateIpv4(c) || validateIpv6(c);
    }
    default: {
      // TXT
      return true;
    }
  }
}
