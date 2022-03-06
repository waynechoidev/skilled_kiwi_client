import React from 'react';
import styles from './style.module.css';

export default function Footer() {
  const date = new Date();
  return (
    <footer className={styles.container}>
      (C) {date.getFullYear()}. Wonjun Choi. All rights reserved.
    </footer>
  );
}
