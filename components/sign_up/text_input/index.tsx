import React from 'react';
import styles from './style.module.css';

interface IProps {
  inputType: React.HTMLInputTypeAttribute;
  item: string;
  handler: React.ChangeEventHandler<HTMLInputElement>;
  validChecker?: boolean;
}

export default function InputItem({ inputType, item, handler, validChecker }: IProps) {
  const isValid = () => {
    if (validChecker !== undefined && item.length > 0) {
      return <p>{validChecker ? 'O' : 'X'}</p>;
    }
  };

  return (
    <div>
      <input
        type={inputType}
        name={item}
        value={item}
        onChange={handler}
        className={styles.input}
      />
      {isValid()}
    </div>
  );
}
