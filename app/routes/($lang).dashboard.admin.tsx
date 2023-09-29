import clsx from 'classnames';
import {
  json,
  type ActionFunction,
  type LoaderFunction
} from '@remix-run/cloudflare';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { toUnicode } from '~/helpers/punycode';

export const loader: LoaderFunction = async ({ context }) => {
  const records = await context.services.records.getPendingRecords();
  return json({
    records
  });
};

export const action: ActionFunction = async () => {};

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
              <tr key={record.name}>
                <td>{record.type}</td>
                <td>{toUnicode(`${record.name}.${record.zone_name}`)}</td>
                <td>{record.content}</td>
                <td>{record.purpose}</td>
                <td>{record.username}</td>
                <td>
                  <button
                    className={clsx('btn btn-xs btn-success', {
                      'btn-disabled': state !== 'idle'
                    })}>
                    {t('domain.approve')}
                  </button>{' '}
                  <button
                    className={clsx('btn btn-xs btn-error', {
                      'btn-disabled': state !== 'idle'
                    })}>
                    {t('domain.decline')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
