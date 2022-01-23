import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';

const date = new Date();

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;

  switch (pathName) {
    case '/signin':
      return <Component {...pageProps} />;
      break;

    case '/':
      return (
        <Layout date={date}>
          <Component {...pageProps} />
        </Layout>
      );
      break;

    default:
      return <p>error</p>;
      break;
  }
}

export default MyApp;
