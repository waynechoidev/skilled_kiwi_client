import React, { ReactChild, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../../../atoms/is_authorized';
import { tokenState } from '../../../atoms/token';
import AuthService from '../../../service/auth';
import Footer from '../footer';
import Header from '../header';
import styles from './style.module.css';

interface IProps {
  children: ReactChild;
  date: Date;
  auth: AuthService;
}

export default function Layout({ children, date, auth }: IProps) {
  const [token, setToken] = useRecoilState(tokenState);
  const [isAuthorized, setIsAuthorized] = useRecoilState(authState);
  useEffect(() => {
    auth.init(setToken, setIsAuthorized);
  }, []);

  return (
    <div className={styles.container}>
      <Header auth={auth} />
      <section className={styles.contents}>{children}</section>
      <Footer date={date} />
    </div>
  );
}
