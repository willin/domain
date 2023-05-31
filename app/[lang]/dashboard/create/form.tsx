'use client';
import clsx from 'classnames';
import { useEffect, useState, useRef } from 'react';
import { Locale } from '@/i18n-config';
import { useLoginInfo } from '../use-login';
import { translation } from '@/lib/i18n';
import { toASCII } from 'punycode';
import { checkDomainAction } from '../actions';
import { DNSType, FreeDomains } from '@/lib/config';

export function CreateForm({ lang }: { lang: Locale }) {
  const t = translation(lang);
  const formRef = useRef<HTMLFormElement>(null);
  const { loading, maxDomains, records } = useLoginInfo();
  const [name, setName] = useState('');
  const [valid, setValid] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setValid(false);
  }, [name]);

  const remain = maxDomains - records.length || 0;
  if (loading || remain === 0) {
    return <></>;
  }

  async function submit() {
    console.log('submit');
  }

  async function check() {
    setPending(true);
    const exists = records.find((i) => toASCII(name) === i.name);
    if (exists) {
      setValid(true);
    } else {
      const body = formRef.current as HTMLFormElement & {
        name: { value: string };
        zone_name: { value: string };
        type: { value: keyof typeof FreeDomains };
        content: { value: string };
        proxied: { checked: boolean };
      };
      const result = await checkDomainAction({
        name,
        zone_name: body.zone_name.value
      });
      setValid(result);
    }
    setChecked(true);
    setPending(false);
  }

  return (
    <form action={submit as any} ref={formRef}>
      <div className='form-control my-4'>
        <div className='input-group'>
          <input
            type='text'
            placeholder={t('domain.name')}
            name='name'
            defaultValue={name}
            className={clsx('w-full input input-bordered', {
              'input-error': checked && !valid,
              'input-secondary': !checked || valid
            })}
            onChange={(e) => setName(e.target.value.trim())}
          />
          <select
            name='zone_name'
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
            className={clsx('select select-bordered', {
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
            placeholder={t('domain.content')}
            name='content'
            className={clsx('w-full input input-bordered', {
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
            className={clsx('toggle toggle-secondary', {
              'input-disabled': !valid
            })}
            disabled={!valid}
            defaultChecked
          />
        </label>
      </div>

      <div className='form-control my-2'>
        <button
          type='submit'
          disabled={!valid}
          className={clsx('btn', {
            'btn-disabled': pending,
            'btn-secondary': valid
          })}>
          {t('domain.save')}
        </button>
      </div>
    </form>
  );
}
