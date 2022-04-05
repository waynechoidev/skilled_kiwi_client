import React from 'react';
import styles from './error_render.module.css';

interface IProps {
  message: string;
}

export default function ErrorRender({ message }: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {message}
        <img src="/img/icon/construction.svg" />
      </div>
    </div>
  );
}
