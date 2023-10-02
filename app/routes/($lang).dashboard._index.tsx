import clsx from 'classnames';
import { json, type LoaderFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import AdSlot from '~/components/adsense';
import {
  AdminUsers,
  MAX_LIMIT_ADMIN,
  MAX_LIMIT_FOLLOWER,
  MAX_LIMIT_USER,
  MAX_LIMIT_VIP,
  PendingStatus
} from '~/config';
import { toUnicode } from '~/helpers/punycode';
import { useEffect, useState } from 'react';
import { LocaleLink } from '~/components/link';

export const loader: LoaderFunction = async ({ request, context }) => {
  const user =
    await context.services.auth.authenticator.isAuthenticated(request);

  const records = await context.services.records.getUserRecords({
    username: user.username
  });

  return json({ records, user });
};

export default function Dashboard() {
  const { records, user } = useLoaderData<typeof loader>();
  const { t, locale } = useI18n();
  const [following, setFollowing] = useState(false);
  const [maxDomains, setMaxDomains] = useState(0);

  const { username, vip = false } = user;
  const admin = AdminUsers.includes(username);

  useEffect(() => {
    if (!username || vip || admin) {
      return;
    }
    if (AdminUsers.includes(username)) {
      setFollowing(true);
      return;
    }
    fetch(
      `https://api.github.com/users/${username}/following/${AdminUsers?.[0]}`
    )
      .then((res) => {
        if (res.status === 204) {
          setFollowing(true);
        }
      })
      .catch(() => {});
  }, [username, admin, vip]);

  useEffect(() => {
    if (admin) {
      setMaxDomains(MAX_LIMIT_ADMIN);
    } else if (vip) {
      setMaxDomains(MAX_LIMIT_VIP);
    } else if (following) {
      setMaxDomains(MAX_LIMIT_FOLLOWER);
    } else {
      setMaxDomains(MAX_LIMIT_USER);
    }
  }, [following, vip, admin]);

  return (
    <>
      <AdSlot />
      <nav className='flex justify-end'>
        <LocaleLink
          className={clsx('btn btn-primary', {
            'btn-disabled': maxDomains - records.length <= 0
          })}
          to='/dashboard/edit'>
          {t('common.create')}
        </LocaleLink>
      </nav>
      <h2 className='my-4 text-2xl text-secondary'>
        {t('common.mine', {
          available: (maxDomains - records.length).toLocaleString()
        })}
      </h2>
      <section>
        <div className='overflow-x-auto w-full'>
          <table className='table table-zebra w-full min-w-full'>
            {/* head */}
            <thead>
              <tr>
                <th>{t('domain.type')}</th>
                <th>{t('domain.name')}</th>
                <th>{t('domain.content')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id || `${record.name}.${record.zone_id}`}>
                  <td>{record.type}</td>
                  <td>{toUnicode(`${record.name}.${record.zone_name}`)}</td>
                  <td>{record.content}</td>
                  {record.pending !== PendingStatus.APPROVED ? (
                    <td>
                      {t(
                        record.pending === PendingStatus.PENDING
                          ? 'domain.pending'
                          : 'domain.decline'
                      )}
                    </td>
                  ) : (
                    <td>
                      <LocaleLink
                        className='link link-primary'
                        to={`/dashboard/edit/${record.id}`}>
                        {t('common.edit')}
                      </LocaleLink>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className='pt-4 text-info'>{t('common.limit_info')}</h3>
          <ul className='list-disc pl-4'>
            <li>
              {t('common.user')}:{' '}
              <span className='badge badge-primary'>{MAX_LIMIT_USER}</span>
            </li>
            <li>
              {t('common.follower')}:{' '}
              <span className='badge badge-secondary'>
                {MAX_LIMIT_FOLLOWER}
              </span>
              <a
                href='https://github.com/willin'
                target='_blank'
                className='btn btn-xs btn-secondary ml-2'
                rel='noreferrer'>
                {t('common.follow')}
              </a>
            </li>
            <li>
              {t('common.vip')}:{' '}
              <span className='badge badge-accent'>{MAX_LIMIT_VIP}</span>
              <a
                target='_blank'
                className='btn btn-xs btn-accent ml-2'
                href={
                  locale() === 'zh'
                    ? 'https://afdian.net/a/willin'
                    : 'https://github.com/sponsors/willin'
                }
                rel='noreferrer'>
                {t('common.donate')}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
