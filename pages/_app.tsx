import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthProvider, { authContext } from '../context/auth';
import { useContext } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;
  const urlBase = 'http://localhost:8080';

  const auth = useContext(authContext);
  const isAuth = auth.isAuth;

  console.log(isAuth);
  return (
    <AuthProvider urlBase={urlBase}>
      {pathName === '/sign_in' ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} urlBase={urlBase} />
        </Layout>
      )}
    </AuthProvider>
  );
}

export default MyApp;
