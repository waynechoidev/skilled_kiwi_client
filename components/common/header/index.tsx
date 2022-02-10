import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../atoms/is_authorized';
import AuthService from '../../../modules/auth';
import styles from './style.module.css';

interface IProps {
  auth: AuthService;
}

export default function Header({ auth }: IProps) {
  const isAuthorized = useRecoilValue(authState);
  interface menu {
    name: string;
  }
  const menus: menu[] = [
    { name: 'Find Requests' },
    { name: 'Post a Request' },
    { name: 'Life Hack' },
  ];

  const router = useRouter();
  return (
    <header className={styles.container}>
      <div className={styles.logo_area}>
        <img src="/img/logo.png" />
        <div className={styles.auth}>
          {!isAuthorized ? (
            <>
              <span
                onClick={() => {
                  router.push('/sign_in');
                }}
              >
                Sign In
              </span>
              <span
                onClick={() => {
                  router.push('/sign_up');
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <span
              onClick={() => {
                auth.signOut();
              }}
            >
              Sign Out
            </span>
          )}
        </div>
      </div>
      <div className={styles.menu_bar}>
        <div className={styles.menu_wrapper}>
          {menus.map((menu, i) => (
            <span key={i}>{menu.name}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
