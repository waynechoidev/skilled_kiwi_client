import React, { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import styles from './input.module.css';

interface IProps {
  type: HTMLInputTypeAttribute;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}
export default function Input({ type, name, value, onChange }: IProps) {
  return (
    <div className={styles.container}>
      <input
        className={styles.text_input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
