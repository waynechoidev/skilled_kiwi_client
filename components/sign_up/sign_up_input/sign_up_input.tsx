import React, { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import ErrorMessage from '../../common/error_message/error_message';
import Input from '../../common/input/input';
import styles from './sign_up_input.module.css';

interface IProps {
  type: HTMLInputTypeAttribute;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  error?: string;
}
export default function SignUpInput({ type, name, value, onChange, error }: IProps) {
  const isValid = (item: string, error?: string) => {
    switch (name) {
      case 'username':
      case 'password':
      case 'confirmPassword':
      case 'email':
        if (item.length > 0) {
          return <img className={styles.valid_icon} src={error ? '/img/no.svg' : '/img/yes.svg'} />;
        }
        break;
    }
  };
  return (
    <div>
      <div className={styles.input_wrapper}>
        <Input type={type} name={name} value={value} onChange={onChange} />
        {isValid(value, error)}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}
