import clsx from 'classnames';
import {
  json,
  type ActionFunction,
  type LoaderFunction
} from '@remix-run/cloudflare';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { toUnicode } from '~/helpers/punycode';

export const loader: LoaderFunction = async ({ context }) => {
  const records = await context.services.records.getPendingRecords();
  return json({
    records
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const _action = formData.get('_action');
  const name = formData.get('name');
  const zone_id = formData.get('zone_id');

  if (_action === 'approve') {
    await context.services.records.approvePendingRecord({ name, zone_id });
  }
  if (_action === 'decline') {
    await context.services.records.declinePendingRecord({ name, zone_id });
  }
  return json({ success: 1 });
};

export default function AdminPanel() {
  const { records } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const { t } = useI18n();

  return (
    <section>
      <div className='overflow-x-auto w-full'>
        <table className='table table-zebra w-full min-w-full'>
          {/* head */}
          <thead>
            <tr>
              <th>{t('domain.type')}</th>
              <th>{t('domain.name')}</th>
              <th>{t('domain.content')}</th>
              <th>{t('domain.purpose')}</th>
              <th>{t('domain.username')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${record.name}.${record.zone_name}`}>
                <td>{record.type}</td>
                <td>{toUnicode(`${record.name}.${record.zone_name}`)}</td>
                <td>{record.content}</td>
                <td>{record.purpose}</td>
                <td>{record.username}</td>
                <td>
                  <Form method='POST' className='inline' action='.'>
                    <input type='hidden' name='name' value={record.name} />
                    <input
                      type='hidden'
                      name='zone_id'
                      value={record.zone_id}
                    />
                    <button
                      type='submit'
                      name='_action'
                      value='approve'
                      className={clsx('btn btn-xs btn-success', {
                        'btn-disabled': state !== 'idle'
                      })}>
                      {t('domain.approve')}
                    </button>{' '}
                  </Form>
                  <Form method='POST' className='inline' action='.'>
                    <input type='hidden' name='name' value={record.name} />
                    <input
                      type='hidden'
                      name='zone_id'
                      value={record.zone_id}
                    />
                    <button
                      type='submit'
                      name='_action'
                      value='decline'
                      className={clsx('btn btn-xs btn-error', {
                        'btn-disabled': state !== 'idle'
                      })}>
                      {t('domain.decline')}
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
