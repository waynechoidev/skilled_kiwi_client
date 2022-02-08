import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import { AuthService } from '../service/auth';
import { RecoilRoot } from 'recoil';
import { useState } from 'react';
import Initializer from '../components/common/initializer';

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;
  const date = new Date();
  const [auth] = useState(new AuthService());

  return (
    <RecoilRoot>
      <Initializer auth={auth} date={date} />
      {pathName === '/sign_in' ? (
        <Component {...pageProps} auth={auth} date={date} />
      ) : (
        <Layout date={date} auth={auth}>
          <Component {...pageProps} auth={auth} />
        </Layout>
      )}
    </RecoilRoot>
  );
}

export default MyApp;
