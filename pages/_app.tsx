import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/common/layout';
import { useRouter } from 'next/router';
import AuthService from '../utils/modules/auth';
import { RecoilRoot } from 'recoil';
import Initializer from '../components/common/initializer';
import RequestService from '../utils/modules/request';

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter().pathname;
  const date = new Date();
  const urlBase = 'http://localhost:8080';
  const auth = AuthService.getInstance(urlBase);
  const request = RequestService.getInstance(urlBase);

  return (
    <RecoilRoot>
      <Initializer auth={auth} date={date} />
      {pathName === '/sign_in' ? (
        <Component {...pageProps} auth={auth} date={date} />
      ) : (
        <Layout date={date} auth={auth}>
          <Component {...pageProps} auth={auth} request={request} />
        </Layout>
      )}
    </RecoilRoot>
  );
}

export default MyApp;
