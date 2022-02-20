import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../atoms/auth';
import AuthService from '../../../utils/modules/auth';
import styles from './style.module.css';

interface IProps {
  auth: AuthService;
}

export default function Header({ auth }: IProps) {
  const isAuthorized = useRecoilValue(authState);
  interface menu {
    name: string;
    src: string;
  }
  const menus: menu[] = [
    { name: 'Find Requests', src: '/find_requests' },
    { name: 'Post a Request', src: '/post_request' },
    { name: 'Life Hack', src: '' },
  ];

  const router = useRouter();
  return (
    <header className={styles.container}>
      <div className={styles.logo_area}>
        <img
          src="/img/logo.png"
          onClick={() => {
            router.push('/');
          }}
        />
        <div className={styles.auth}>
          {isAuthorized === 'no' ? (
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
            <span
              key={i}
              onClick={() => {
                router.push(menu.src);
              }}
            >
              {menu.name}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
