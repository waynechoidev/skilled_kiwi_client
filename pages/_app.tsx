import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthService from '../service/auth';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  const date = new Date();
  const pathName = useRouter().pathname;

  const auth = new AuthService();

  switch (pathName) {
    case '/sign_in':
      return (
        <RecoilRoot>
          <Component {...pageProps} auth={auth} />
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
