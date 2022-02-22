import React from 'react';
import { RequestsItem } from '../../../data/request';
import styles from './style.module.css';

interface IProps {
  item: RequestsItem;
}
export default function SearchItem({ item }: IProps) {
  const imgSrc = item.images[0] ? item.images[0] : '/img/blank.png';

  const date = (dateStr: string) => {
    const newDate = new Date(dateStr).toDateString().split(' ');
    return `${newDate[0]}, ${newDate[1]} ${newDate[2]}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.image_wrapper}>
        <img src={imgSrc} />
      </div>
      <div className={styles.contents}>
        <div>
          <p className={styles.location_time}>
            {item.suburb}, {item.district} | {date(item.createdAt)}
          </p>
          <h3>{item.title}</h3>
          <p className={styles.detail}>{item.detail}</p>
        </div>
        <div>
          <p className={styles.pay}>${item.pay}.00</p>
        </div>
      </div>
    </div>
  );
}
