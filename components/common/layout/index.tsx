import React, { ReactChild } from 'react';

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
  return (
    <div className={styles.container}>
      <Header auth={auth} />
      <section className={styles.contents}>{children}</section>
      <Footer date={date} />
    </div>
  );
}
