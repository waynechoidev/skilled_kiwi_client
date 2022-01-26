import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthService from '../service/auth';
import { RecoilRoot } from 'recoil';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const date = new Date();
  const pathName = useRouter().pathname;
  const [auth] = useState(new AuthService());

  useEffect(() => {
    const storage = window.localStorage.getItem('stored') ? 'localStorage' : 'sessionStorage';

    auth.init(
      date,
      window[storage].getItem('token')!,
      window[storage].getItem('refresh_token')!,
      window[storage].getItem('expired_time')!,
      window[storage].getItem('user_id')!
    );
  }, []);

  switch (pathName) {
    case '/sign_in':
      return (
        <RecoilRoot>
          <Component {...pageProps} auth={auth} date={date} />
        </RecoilRoot>
      );
      break;

    case '/':
      return (
        <RecoilRoot>
          <Layout date={date}>
            <Component {...pageProps} />
          </Layout>
        </RecoilRoot>
      );
      break;

    default:
      return <p>error</p>;
      break;
  }
}

export default MyApp;
