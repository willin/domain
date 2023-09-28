import {
  Form,
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useRouteLoaderData
} from '@remix-run/react';
import { useEffect } from 'react';
import { useI18n } from 'remix-i18n';
import { AdminUsers } from '~/config';

export default function DashboardLayout() {
  const { user } = useRouteLoaderData('root');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const i18n = useI18n();
  const { t } = i18n;

  useEffect(() => {
    if (!user) {
      navigate(`/${i18n.locale()}`, { replace: true });
    }
  }, [user, i18n, navigate]);

  return (
    user && (
      <main>
        <div className='ads mx-auto text-center mb-4'>
          <ins
            className='adsbygoogle'
            style={{ display: 'block' }}
            data-ad-client='ca-pub-5059418763237956'
            data-ad-slot='9518721243'
            data-ad-format='auto'
            data-full-width-responsive='true'></ins>
        </div>
        <article className='prose'>
          <Outlet />
        </article>
        <div className='text-center py-4'>
          {!pathname.endsWith('/dashboard') && (
            <div className='tooltip mr-4' data-tip={t('common.go_back')}>
              <button className='btn btn-circle' onClick={() => navigate(-1)}>
                <svg
                  viewBox='0 0 512 512'
                  className='fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'>
                  <path
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={48}
                    d='M244 400L100 256l144-144M120 256h292'
                  />
                </svg>
              </button>
            </div>
          )}
          {AdminUsers.includes(user.username) && (
            <div className='tooltip mr-4' data-tip={'Manage'}>
              <Link
                to={`/${i18n.locale()}/dashboard/admin`}
                className='btn btn-circle'>
                <svg
                  className='fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 512 512'>
                  <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
                </svg>
              </Link>
            </div>
          )}
          <div className='tooltip' data-tip={t('common.logout')}>
            <Form action='/api/logout' method='post'>
              <button className='btn btn-circle' type='submit'>
                <svg
                  className='fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 512 512'>
                  <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
                </svg>
              </button>
            </Form>
          </div>
        </div>
      </main>
    )
  );
}
