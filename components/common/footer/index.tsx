import React from 'react';
import styles from './style.module.css';

interface IProps {
  date: Date;
}

export default function Footer({ date }: IProps) {
  return (
    <footer className={styles.container}>
      (C) {date.getFullYear()}. Wonjun Choi. All rights reserved.
    </footer>
  );
}
