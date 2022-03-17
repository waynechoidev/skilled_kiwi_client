import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthProvider from '../context/auth/auth';

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;
  const urlBase = 'http://skilledkiwi.herokuapp.com';

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
