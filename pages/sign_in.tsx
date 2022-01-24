import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AuthService from '../service/auth';
import styles from '../styles/sign_in.module.css';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { tokenState } from '../atoms/token';

interface IProps {
  auth: AuthService;
}

export default function SignIn({ auth }: IProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isHideError, setIsHideError] = useState(true);

  const [token, setToken] = useRecoilState(tokenState);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsHideError(true);
    e.preventDefault();

    const result = await auth.signIn(username, password);

    setPassword('');

    if (result.status > 199 || result.status < 300) {
      if (isChecked) {
        window.localStorage.setItem('token', result.token!);
      } else {
        window.sessionStorage.setItem('token', result.token!);
      }
      setToken(result.token!);
      router.back();
    } else if (result.status > 399) {
      setErrorMsg(result.message!);
      setIsHideError(false);
    } else {
      setErrorMsg('Something Wrong!');
      setIsHideError(false);
    }
  };

  useEffect(() => {
    const localStorageToken = window.localStorage.getItem('token');
    const sessionStorageToken = window.sessionStorage.getItem('token');
    if (localStorageToken || sessionStorageToken) {
      router.push('/');
    }
  }, []);

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
          {!isHideError && <div className={styles.error}>{errorMsg}</div>}
          <input type="submit" value="Sign In" className={`${styles.button} ${styles.input_box}`} />
        </form>
        <div className={styles.footer}>
          Don't have an account? <a>Sign Up</a>
        </div>
      </div>
    </div>
  );
}
