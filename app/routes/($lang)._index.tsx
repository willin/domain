import { type LoaderFunction, json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { toUnicode } from '~/helpers/punycode';

export const loader: LoaderFunction = async ({ context, params }) => {
  const FreeDomains = context.env.FREE_DOMAINS;
  const sites = await context.services.records.getTopSites();
  const counter = await context.services.records.countSites();

  return json({
    sites,
    counter: counter
      .map(([name, count]) => [
        FreeDomains.find(([n, i]) => i === name)?.[0] || '',
        count
      ])
      .filter((item) => item?.[0])
  });
};

export default function Index() {
  const i18n = useI18n();
  const { sites, counter } = useLoaderData<typeof loader>();
  const { t } = i18n;

  return (
    <div className='flex justify-center flex-col'>
      <div>
        <h2 className='mt-4 text-2xl'>{t('common.available')}</h2>
        <h3>
          ({t('common.total')}:{' '}
          <span className='badge badge-xs'>
            {(counter[0][1] || 0).toLocaleString()}
          </span>
          )
        </h3>
        <ol className='list-disc list-inside my-4'>
          {counter.map(
            ([domain, count], i) =>
              i > 0 && (
                <li key={domain}>
                  {domain}{' '}
                  <span className='badge badge-xs'>
                    {(count || 0).toLocaleString()}
                  </span>
                </li>
              )
          )}
        </ol>
      </div>
      <Form method='post' action='/auth/sso'>
        <button className='btn glass mb-4 text-primary w-full' type='submit'>
          {t('common.login')}
        </button>
      </Form>
      <div className='my-2'>
        <a
          className='link text-secondary'
          href='https://alias.willin.wang'
          target='_blank'
          rel='noreferrer'>
          {t('common.alias')}
        </a>
      </div>
      <h2 className='my-4 text-2xl'>{t('common.rank')}</h2>
      <ol className='list-decimal list-inside'>
        {sites.map(([name, count]) => (
          <li key={name}>
            <a
              className='btn-link leading-6 text-primary dark:text-secondary'
              href={`https://${name}`}
              target='_blank'
              rel='noreferrer'>
              {toUnicode(name)}
            </a>
            <div className='badge badge-xs'>
              {count.toLocaleString()} {t('common.views')}
            </div>
          </li>
        ))}
      </ol>
      <h3 className='my-2 text-sm'>{t('common.rank_notice')}</h3>
    </div>
  );
}
