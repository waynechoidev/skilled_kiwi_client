import React, { useState } from 'react';
import AuthService from '../service/auth';
import styles from '../styles/sign_in.module.css';

interface IProps {
  auth: AuthService;
}

export default function SignIn({ auth }: IProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.signIn(username, password, isChecked);
    setPassword('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.window}>
        <img src="/img/logo.png" />
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
            className={styles.input_box}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            className={styles.input_box}
          />
          <div className={styles.condition}>
            <span className={styles.check_stay}>
              <input
                type="checkbox"
                name="stay"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                }}
                className={styles.input_check}
              />
              Stay Signed In
            </span>
            <a>Forgot Password?</a>
          </div>
          <input type="submit" value="Sign In" className={`${styles.button} ${styles.input_box}`} />
        </form>
        <div className={styles.footer}>
          Don't have an account? <a>Sign Up</a>
        </div>
      </div>
    </div>
  );
}
