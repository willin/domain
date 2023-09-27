import { Form, NavLink, useRouteLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';

export default function Index() {
  const i18n = useI18n();
  const data = useRouteLoaderData('root');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>{i18n.locale()}</h1>
      <h2>{i18n.t('domain.type')}</h2>
      <Form method='post' action='/auth/github'>
        <button>Sign In</button>
      </Form>
      <ul>
        <li>
          <NavLink to={'/zh'}>Zh</NavLink>
        </li>
        <li>
          <NavLink to={'/en'}>En</NavLink>
        </li>
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
