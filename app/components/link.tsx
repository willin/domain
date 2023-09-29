import {
  Link,
  NavLink,
  type LinkProps,
  type NavLinkProps
} from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { i18nConfig } from '~/i18n';

export function LocaleLink({
  to,
  children,
  ...props
}: LinkProps & { to: string }) {
  const { locale } = useI18n();
  const path =
    i18nConfig.fallbackLng === locale() ? to ?? '/' : `/${locale()}${to}`;

  return (
    <Link to={path} {...props}>
      {children}
    </Link>
  );
}

export function LocaleNavLink({
  to,
  children,
  ...props
}: NavLinkProps & { to: string }) {
  const { locale } = useI18n();
  const path = i18nConfig.fallbackLng === locale() ? to : `/${locale()}${to}`;

  return (
    <NavLink to={path} {...props}>
      {children}
    </NavLink>
  );
}
