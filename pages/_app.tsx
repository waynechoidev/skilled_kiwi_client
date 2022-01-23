import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const date = new Date();
  const pathName = useRouter().pathname;

  switch (pathName) {
    case '/sign_in':
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
