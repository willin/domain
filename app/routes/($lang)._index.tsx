import { NavLink } from '@remix-run/react';
import { useI18n } from 'remix-i18n';

export default function Index() {
  const i18n = useI18n();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>{i18n.locale()}</h1>
      <h2>{i18n.t('nav.home')}</h2>
      <ul>
        <li>
          <NavLink to={'/zh'}>Zh</NavLink>
        </li>
        <li>
          <NavLink to={'/en'}>En</NavLink>
        </li>
      </ul>
    </div>
  );
}
