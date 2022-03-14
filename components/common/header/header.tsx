import Link from 'next/link';
import React, { useContext } from 'react';
import { authContext } from '../../../context/auth';
import styles from './header.module.css';

export default function Header() {
  const auth = useContext(authContext);
  const isAuth = auth.isAuth;

  interface menu {
    name: string;
    src: string;
  }
  const menus: menu[] = [
    { name: 'Find Requests', src: '/find_requests' },
    { name: 'Post a Request', src: '/post_request' },
    { name: 'Life Hack', src: '' },
  ];
  return (
    <header className={styles.container}>
      <div className={styles.logo_area}>
        <Link href="/">
          <a href="/">
            <img src="/img/logo.png" />
          </a>
        </Link>

        <div className={styles.auth}>
          {isAuth === 'no' ? (
            <>
              <Link href="/sign_in">
                <a href="/sign_in">
                  <span>Sign In</span>
                </a>
              </Link>
              <Link href="/sign_up">
                <a href="/sign_up">
                  <span>Sign Up</span>
                </a>
              </Link>
            </>
          ) : (
            <span
              onClick={() => {
                auth.service.signOut();
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
            <Link href={menu.src} key={i}>
              <a href={menu.src}>
                <span>{menu.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
