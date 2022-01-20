import React from 'react';
import styles from './style.module.css';

export default function Header() {
  interface menu {
    name: string;
  }
  const menus: menu[] = [
    { name: 'Find Requests' },
    { name: 'Post a Request' },
    { name: 'Life Hack' },
  ];
  return (
    <header className={styles.container}>
      <div className={styles.logo_area}>
        <img src="/img/logo.png" />
        <div className={styles.auth}>
          <span>Sign In</span>
          <span>Sign Up</span>
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
