import React, { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import ErrorMessage from '../../common/error_message';
import Input from '../../common/input';
import styles from './style.module.css';

interface IProps {
  type: HTMLInputTypeAttribute;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  error?: string;
}
export default function RequestInput({ type, name, value, onChange, error }: IProps) {
  return (
    <div className={styles.container}>
      <Input type={type} name={name} value={value} onChange={onChange} />
      <ErrorMessage error={error} />
    </div>
  );
}
