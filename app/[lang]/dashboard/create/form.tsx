'use client';
import clsx from 'classnames';
import { useEffect, useState } from 'react';
import { Locale } from '@/i18n-config';
import { useLoginInfo } from '../use-login';
import { translation } from '@/lib/i18n';
import { toASCII } from 'punycode';
import { checkDomainAction, createDomainAction } from '../actions';
import { DNSType, FreeDomains } from '@/lib/config';
import { getPlaceHolder, validateContent } from '../../helper';
import { DomainNotice } from './notice';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { CFResult } from '@/lib/dns';

export function CreateForm({ lang }: { lang: Locale }) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const t = translation(lang);
  const { loading, maxDomains, username } = useLoginInfo();
  const [name, setName] = useState('');
  const [zoneName, setZoneName] = useState(FreeDomains[0]);
  const [proxied, setProxied] = useState(true);
  const [type, setType] = useState('CNAME');
  const [content, setContent] = useState('');
  const [valid, setValid] = useState(false);
  const [validContent, setValidContent] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState(false);
  const [agree, setAgree] = useState(false);
  const [records, setRecords] = useState<CFResult['result'][]>([]);

  useEffect(() => {
    void fetch('/api/me', { next: { revalidate: 0 } })
      .then((res) => res.json())
      .then(({ records }: { records: CFResult['result'][] }) => {
        setRecords(records);
      });
  }, []);
  useEffect(() => {
    setValid(false);
  }, [name]);

  const remain = maxDomains - records.length || 0;
  if (loading || remain === 0) {
    return <></>;
  }

  async function submit() {
    setPending(true);
    await createDomainAction({
      name,
      zone_name: zoneName,
      content,
      type,
      proxied,
      username
    } as CFResult['result'])
      .then(async () => {
        await mutate('/api/me');
        void router.push(`/${lang}/dashboard`);
      })
      .catch(() => {});
    setPending(false);
  }

  async function check() {
    setPending(true);
    const exists = records.find((i) => `${toASCII(name)}.${zoneName}` === i.name);
    if (exists) {
      setValid(true);
    } else {
      const result = await checkDomainAction({
        name,
        zone_name: zoneName
      } as CFResult['result']).catch(() => false);
      setValid(result);
    }
    setChecked(true);
    setPending(false);
  }

  return (
    <form action={submit as any}>
      <div className='form-control my-4'>
        <div className='input-group'>
          <input
            type='text'
            placeholder={t('domain.name')}
            name='name'
            value={name}
            className={clsx('w-full input input-bordered', {
              'input-error': checked && !valid,
              'input-secondary': !checked || valid
            })}
            onChange={(e) => setName(e.target.value.trim())}
          />
          <select
            name='zone_name'
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            className={clsx('select select-bordered', {
              'select-error': checked && !valid,
              'select-secondary': !checked || valid
            })}>
            {FreeDomains.map((d) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            type='button'
            onClick={check}
            disabled={name === ''}
            className={clsx('btn', {
              'btn-disabled': pending,
              'btn-primary': !checked || valid,
              'btn-error': checked && !valid
            })}>
            {t('domain.check')}
          </button>
        </div>
      </div>

      <div className='form-control my-4'>
        <div className='input-group'>
          <select
            disabled={!valid}
            value={type}
            onChange={(e) => setType(e.target.value.trim())}
            className={clsx('select select-bordered select-secondary', {
              'select-disabled': !valid
            })}>
            {DNSType.map((t) => (
              <option value={t} key={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type='text'
            placeholder={getPlaceHolder(type) || t('domain.content')}
            name='content'
            value={content}
            onChange={(e) => {
              setContent(e.target.value.trim());
              setValidContent(validateContent(type, e.target.value.trim()));
              if (valid && content.includes('vercel-dns.com')) {
                setProxied(false);
              }
            }}
            className={clsx('w-full input input-bordered input-secondary', {
              'input-disabled': !valid
            })}
            disabled={!valid}
          />
        </div>
      </div>

      <div className='form-control'>
        <label className='cursor-pointer label'>
          <span className='label-text'>CDN Proxy</span>
          <input
            type='checkbox'
            name='proxied'
            checked={proxied}
            onChange={setProxied.bind(null, !proxied)}
            className={clsx('toggle toggle-secondary', {
              'input-disabled': !valid
            })}
            disabled={!valid}
          />
        </label>
      </div>

      <div className='form-control my-2'>
        <label className='label cursor-pointer'>
          <span className='label-text'>
            {t('domain.agree')}:
            <a
              className='text-primary'
              href='https://github.com/willin/domain#%E8%A7%84%E5%88%99-rules'
              target='_blank'>
              {t('domain.rules')}
            </a>
          </span>
          <input
            type='checkbox'
            className={clsx('checkbox', {
              'input-disabled': !valid
            })}
            checked={agree}
            onChange={setAgree.bind(null, !agree)}
          />
        </label>
      </div>

      <div className='form-control my-2'>
        <button
          type='submit'
          disabled={!valid}
          onClick={() => setPending(true)}
          className={clsx('btn', {
            'btn-disabled': pending || !validContent || !agree,
            'btn-secondary': valid
          })}>
          {t('domain.save')}
        </button>
      </div>

      <DomainNotice lang={lang} name={name} domain={zoneName} />
    </form>
  );
}
