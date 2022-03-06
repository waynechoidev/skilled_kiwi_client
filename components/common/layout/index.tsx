import React, { ReactChild } from 'react';

import AuthService from '../../../utils/modules/auth';
import Footer from '../footer';
import Header from '../header';
import styles from './style.module.css';

interface IProps {
  children: ReactChild;
}

export default function Layout({ children }: IProps) {
  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.contents}>{children}</section>
      <Footer />
    </div>
  );
}
