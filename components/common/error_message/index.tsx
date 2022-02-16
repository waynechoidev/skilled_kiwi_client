import React from 'react';
import styles from './style.module.css';

interface IProps {
  error?: string;
}

export default function ErrorMessage({ error }: IProps) {
  return <p className={styles.error}>{error}</p>;
}
