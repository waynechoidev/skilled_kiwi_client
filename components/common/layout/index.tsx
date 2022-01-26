import React, { ReactChild, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState } from '../../../atoms/token';
import Footer from '../footer';
import Header from '../header';
import styles from './style.module.css';

interface IProps {
  children: ReactChild;
  date: Date;
}

export default function Layout({ children, date }: IProps) {
  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.contents}>{children}</section>
      <Footer date={date} />
    </div>
  );
}
