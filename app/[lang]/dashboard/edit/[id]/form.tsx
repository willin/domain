'use client';
import clsx from 'classnames';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { DNSType } from '@/lib/config';
import { getPlaceHolder, validateContent } from '@/app/[lang]/helper';
import { useSWRConfig } from 'swr';
import { useLoginInfo } from '../../use-login';
import { toASCII, toUnicode } from 'punycode';
import { deleteDomainAction, updateDomainAction } from '../../actions';
import { CFResult } from '@/lib/dns';

export function UpdateForm({ lang }: { lang: Locale }) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const params = useParams();
  const t = translation(lang);
  const { username } = useLoginInfo();
  const [record, setRecord] = useState<CFResult['result'] | null>(null);
  const [proxied, setProxied] = useState(true);
  const [type, setType] = useState('CNAME');
  const [content, setContent] = useState('');
  const [validContent, setValidContent] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void fetch('/api/me', { next: { revalidate: 0 } })
      .then((res) => res.json())
      .then(({ records }: { records: CFResult['result'][] }) => {
        const record = records.find((x) => x.id === params.id);
        if (record) {
          setRecord(record);
          setProxied(record.proxied ?? true);
          setType(record.type ?? 'CNAME');
          setContent(record?.content ?? '');
        }
      });
  }, []);

  if (!record || !record.comment || record.comment !== username) {
    return <></>;
  }

  async function submit() {
    if (!record) return;
    setPending(true);
    await updateDomainAction({
      id: record.id,
      zone_name: toUnicode(record?.zone_name),
      name: record.name?.split('.')?.[0],
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

  async function confirmDelete() {
    if (!record) return;
    if (!confirm(t('domain.confirm_delete'))) {
      return;
    }
    setPending(true);
    await deleteDomainAction({
      id: record.id,
      zone_name: toUnicode(record?.zone_name),
      username
    } as CFResult['result'])
      .catch(() => {})
      .finally(async () => {
        await mutate('/api/me');
        void router.push(`/${lang}/dashboard`);
      });

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
            defaultValue={toUnicode(record.name)}
            className='w-full input input-bordered input-disabled'
          />
        </div>
      </div>
      <div className='form-control my-4'>
        <div className='input-group'>
          <select
            value={type}
            onChange={(e) => setType(e.target.value.trim())}
            className='select select-bordered select-secondary'>
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
            }}
            className='w-full input input-bordered input-secondary'
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
            className='toggle toggle-secondary'
          />
        </label>
      </div>
      <div className='form-control my-2'>
        <button
          type='submit'
          disabled={pending}
          onClick={() => setPending(true)}
          className={clsx('btn btn-secondary', {
            'btn-disabled': pending || !validContent
          })}>
          {t('domain.save')}
        </button>
      </div>
      {toASCII(record.name) !== toUnicode(record.name) && (
        <div className='form-control my-2'>
          <label className='label'>
            <span className='label-text'>{t('domain.punycode_notice')}</span>
          </label>
          <div className='mockup-code text-sm'>
            <pre>
              <code>{toASCII(record.name)}</code>
            </pre>
          </div>
        </div>
      )}
      <div className='form-control my-2'>
        <button type='button' disabled={pending} onClick={confirmDelete} className='btn btn-warning'>
          {t('common.delete')}
        </button>
      </div>
    </form>
  );
}
