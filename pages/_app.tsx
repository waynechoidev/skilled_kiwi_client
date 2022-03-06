import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthProvider from '../context/auth';

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;
  const urlBase = 'http://localhost:8080';

  return (
    <AuthProvider>
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
