import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Card } from '../../../data/home';
import styles from './style.module.css';

interface IProps {
  cardList: Card[];
}
export default function Carousel({ cardList }: IProps) {
  const [page, setPage] = useState(0);
  const [animate, setAnimate] = useState(false);
  const handleAnimation = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  };
  useEffect(() => {
    handleAnimation();
  }, []);
  return (
    <section className={`${styles.container} ${animate ? styles.animate : ''}`}>
      <img className={styles.card_img} src={cardList[page].bg} />
      <div className={`${styles.msg_wrapper} ${page % 2 ? styles.right_msg : ''}`}>
        {cardList[page].msg()}
      </div>
      <ul className={styles.button_wrapper}>
        {cardList.map((card, index) => (
          <li
            key={index}
            className={index == page ? styles.selected_button : styles.button}
            onClick={() => {
              setPage(index);
              handleAnimation();
            }}
          >
            ·
          </li>
        ))}
      </ul>
    </section>
  );
}
