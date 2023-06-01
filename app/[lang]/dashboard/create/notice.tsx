'use client';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { toASCII } from 'punycode';

export function DomainNotice({ lang, name, domain }: { lang: Locale; name: string; domain: string }) {
  const t = translation(lang);

  return (
    <>
      {name && toASCII(`${name || ''}.${domain}`) !== `${name || ''}.${domain}` && (
        <div className='form-control my-2'>
          <label className='label'>
            <span className='label-text'>{t('domain.punycode_notice')}</span>
          </label>
          <div className='mockup-code text-sm'>
            <pre>
              <code>{toASCII(`${name || ''}.${domain}`)}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
