import clsx from 'classnames';
import { type FormEvent, useState } from 'react';
import {
  json,
  type ActionFunction,
  type LoaderFunction,
  redirect
} from '@remix-run/cloudflare';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams
} from '@remix-run/react';
import { DNSType } from '~/config';
import { useI18n } from 'remix-i18n';
import { getPlaceHolder, validateContent } from '~/helpers/validation';
import { toASCII, toUnicode } from '~/helpers/punycode';
import AdSlot from '~/components/adsense';

export const loader: LoaderFunction = async ({ context, params, request }) => {
  const { FREE_DOMAINS } = context.env;

  if (!params?.id) {
    return json({ record: {}, FreeDomains: FREE_DOMAINS });
  }
  const user =
    await context.services.auth.authenticator.isAuthenticated(request);
  const records = await context.services.records.getUserRecords({
    username: user?.username
  });
  const record = records.find((record) => record.id === params.id);
  if (!record) {
    throw Errror('404');
  }
  return json({ record, FreeDomains: FREE_DOMAINS });
};

export const action: ActionFunction = async ({ context, params, request }) => {
  const formData = await request.formData();
  const _action = formData.get('_action');
  const zone_id = formData.get('zone_id');
  const name = formData.get('name');
  const errors = {};
  if (_action === 'check') {
    const available = await context.services.records.checkRecord({
      zone_id,
      name
    });
    return json({ available });
  }

  const content = formData.get('content');
  const type = formData.get('type');
  const proxiable = formData.get('proxiable') ? 1 : 0;
  const purpose = formData.get('purpose') || '';
  const user =
    await context.services.auth.authenticator.isAuthenticated(request);

  if (!validateContent(type, content)) {
    errors.content = true;
  }
  if (!params.id && !/[\u4E00-\u9FFF]/g.test(purpose)) {
    errors.purpose = true;
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors, available: true });
  }
  try {
    if (_action === 'create') {
      await context.services.records.addPendingRecord({
        zone_id,
        name,
        content,
        type,
        proxiable,
        username: user.username,
        purpose
      });
    }
    if (_action === 'edit') {
      await context.services.records.editRecord({
        id: params.id,
        zone_id,
        name,
        content,
        type,
        proxiable
      });
    }
    if (_action === 'delete') {
      await context.services.records.deleteRecord({ zone_id, id: params.id });
    }

    return redirect(`${params.locale ? `/${params.locale}` : ''}/dashboard`);
  } catch (e) {
    errors.server = true;
  }
  return json({ errors, available: true });
};

export default function EditPage() {
  const { id } = useParams();
  const { record, FreeDomains } = useLoaderData<typeof loader>();
  const { errors, available } = useActionData<typeof action>() || {};
  const { state } = useNavigation();
  const { t } = useI18n();

  const [type, setType] = useState(record.type ?? 'CNAME');
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState(record.name ?? '');
  const [domain, setDomain] = useState(
    FreeDomains.find(
      ([, id]) => (record.id ?? FreeDomains?.[0]?.[1]) === id
    )?.[0]
  );

  function validator(event: FormEvent) {
    switch (event.target.name) {
      case 'name': {
        setName(event.target.value.trim());
        break;
      }
      case 'zone_id': {
        setDomain(FreeDomains.find(([, id]) => event.target.value === id)?.[0]);
        break;
      }
      case 'type': {
        setType(event.target.value);
        break;
      }
      case '_agree': {
        setAgree(!agree);
        break;
      }
      default: {
        // do nothing
      }
    }
  }

  return (
    <>
      <h2 className='text-primary text-2xl'>
        {t(id ? 'common.edit' : 'common.create')}
      </h2>
      <Form action='.' method='POST' onChange={validator}>
        <div className='form-control my-4'>
          <div className='input-group'>
            <input
              type='text'
              placeholder={t('domain.name')}
              name='name'
              defaultValue={!id ? '' : record.name}
              readOnly={id || available}
              className={clsx('w-full input input-bordered input-secondary', {
                'input-error': typeof available !== 'undefined' && !available,
                'input-disabled': id || available
              })}
            />
            <select
              name='zone_id'
              defaultValue={!id ? '' : record.zone_id}
              readOnly={id || available}
              className={clsx('select select-bordered select-secondary', {
                'select-error': typeof available !== 'undefined' && !available,
                'select-disabled': id || available
              })}>
              {FreeDomains.map(([name, id]) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </select>
            {!id && (
              <button
                name='_action'
                value='check'
                type='submit'
                disabled={id || available}
                className={clsx('btn btn-secondary', {
                  'btn-error': typeof available !== 'undefined' && !available,
                  'btn-disabled': id || available
                })}>
                {t('domain.check')}
              </button>
            )}
          </div>
        </div>
        {(id || available) && (
          <>
            <div className='form-control my-4'>
              <div className='input-group'>
                <select
                  name='type'
                  className='select select-bordered select-secondary'
                  defaultValue={!id ? 'CNAME' : record.type}>
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
                  defaultValue={!id ? '' : record.content}
                  required
                  className={clsx(
                    'w-full input input-bordered input-secondary',
                    {
                      'input-error': errors && errors.content
                    }
                  )}
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='cursor-pointer label'>
                <span className='label-text'>CDN Proxy</span>
                <input
                  type='checkbox'
                  name='proxiable'
                  defaultChecked={!id ? true : record.proxiable}
                  className='toggle toggle-secondary'
                />
              </label>
            </div>
            {!id && (
              <div className='form-control my-2'>
                <label className='input-group'>
                  <span className='w-32'>{t('domain.purpose')}</span>
                  <input
                    type='text'
                    placeholder={t('domain.purpose_tip')}
                    name='purpose'
                    defaultValue={!id ? '' : record.purpose}
                    required
                    className={clsx(
                      'w-full input input-bordered input-secondary',
                      {
                        'input-error': errors && errors.purpose
                      }
                    )}
                  />
                </label>
              </div>
            )}
            <div className='form-control my-2'>
              <label className='label cursor-pointer'>
                <span className='label-text'>
                  {t('domain.agree')}:
                  <a
                    className='text-primary'
                    href='https://github.com/willin/domain#%E8%A7%84%E5%88%99-rules'
                    target='_blank'
                    rel='noreferrer'>
                    {t('domain.rules')}
                  </a>
                </span>
                <input
                  type='checkbox'
                  name='_agree'
                  className='checkbox'
                  defaultChecked={agree}
                />
              </label>
            </div>
            <div className='form-control my-2'>
              <button
                type='submit'
                name='_action'
                value={id ? 'edit' : 'create'}
                disabled={state !== 'idle' || !agree}
                className={clsx('btn btn-secondary', {
                  'btn-disabled': state !== 'idle' || !agree
                })}>
                {t('domain.save')}
              </button>
            </div>
            {id && (
              <div className='form-control my-2'>
                <button
                  type='submit'
                  name='_action'
                  value='delete'
                  disabled={state !== 'idle'}
                  onClick={() => confirm(t('domain.confirm_delete'))}
                  className={clsx('btn btn-warning', {
                    'btn-disabled': state !== 'idle'
                  })}>
                  {t('common.delete')}
                </button>
              </div>
            )}
            {toASCII(`${name}.${domain}`) !==
              toUnicode(`${name}.${domain}`) && (
              <div className='form-control my-2'>
                <label className='label'>
                  <span className='label-text'>
                    {t('domain.punycode_notice')}
                  </span>
                </label>
                <div className='mockup-code text-sm'>
                  <pre>
                    <code>{toASCII(`${name}.${domain}`)}</code>
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </Form>
      <AdSlot />
    </>
  );
}
