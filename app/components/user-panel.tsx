import { Form, useRouteLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';

function IconUser() {
  return (
    <svg
      viewBox='0 0 1024 1024'
      fill='currentColor'
      className='inline-block h-4 w-4 fill-current md:h-5 md:w-5'
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'>
      <path d='M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z' />
    </svg>
  );
}

export default function UserPanel() {
  const { user } = useRouteLoaderData('root');
  const { t, locale } = useI18n();

  function confirmLogout(e: FormEvent<HTMLFormElement>) {
    if (!confirm(t('common.confirm_logout'))) {
      e.preventDefault();
      return false;
    }
  }

  if (!user)
    return (
      <Form method='post' action='/auth/sso'>
        <button className='btn btn-ghost' type='submit'>
          <IconUser />
        </button>
      </Form>
    );

  return (
    <div className='dropdown dropdown-end'>
      <div tabIndex={0} className='btn btn-ghost gap-1 normal-case'>
        <IconUser />
        <span className='hidden md:inline'>{user.displayName}</span>
        <svg
          width='12px'
          height='12px'
          className='ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 2048 2048'>
          <path d='M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z' />
        </svg>
      </div>
      <div
        tabIndex={0}
        className='dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-16 w-48 overflow-y-auto shadow-2xl'>
        <ul className='menu menu-compact gap-1 p-3'>
          <li>
            <a
              href={
                locale() === 'zh'
                  ? 'https://afdian.net/a/willin'
                  : 'https://github.com/sponsors/willin'
              }
              className='block'
              target='_blank'
              rel='noreferrer'>
              {t('common.upgrade')}
            </a>
          </li>
          <li>
            <a
              href='https://sso.willin.wang/dashboard/me'
              className='block'
              target='_blank'
              rel='noreferrer'>
              {t('common.profile')}
            </a>
          </li>
          <li>
            <Form method='post' action='/auth/logout' className='block'>
              <button
                className='block w-full text-left'
                type='submit'
                onClick={confirmLogout}>
                {t('common.logout')}
              </button>
            </Form>
          </li>
        </ul>
      </div>
    </div>
  );
}
