import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';
import { Card } from '../../../data/home';
import styles from './style.module.css';

interface IProps {
  cardList: Card[];
}
export default function Carousel({ cardList }: IProps) {
  const [page, setPage] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    slideRef.current!.style.transition = 'all 0.5s ease-in-out';
    slideRef.current!.style.transform = `translateX(-${(page * 100) / 3}%)`;
  }, [page]);
  return (
    <section className={`${styles.container} ${animate ? styles.animate : ''}`}>
      <div className={styles.card_wrapper} ref={slideRef}>
        {cardList.map((card, index) => (
          <div className={styles.card} key={index}>
            <img className={styles.card_img} src={card.bg} />
            <div className={`${styles.msg_wrapper} ${index % 2 ? styles.right_msg : ''}`}>
              {card.msg()}
            </div>
          </div>
        ))}
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
