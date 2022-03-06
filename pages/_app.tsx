import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthProvider, { authContext } from '../context/auth';

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;

  return (
    <AuthProvider>
      {pathName === '/sign_in' ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}

export default MyApp;
