import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
const date = new Date();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout date={date}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
