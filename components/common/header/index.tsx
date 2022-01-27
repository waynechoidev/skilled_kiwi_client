import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../../../atoms/is_authorized';
import AuthService from '../../../service/auth';
import styles from './style.module.css';

interface IProps {
  auth: AuthService;
}

export default function Header({ auth }: IProps) {
  const [isAuthorized, setIsAuthorized] = useRecoilState(authState);
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
          {isAuthorized === 'false' ? (
            <>
              <span
                onClick={() => {
                  router.push('/sign_in');
                }}
              >
                Sign In
              </span>
              <span>Sign Up</span>
            </>
          ) : (
            <span
              onClick={() => {
                auth.signOut(setIsAuthorized);
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
