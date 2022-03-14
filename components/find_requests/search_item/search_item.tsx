import React from 'react';
import UtilService from '../../../services/util';
import styles from './search_item.module.css';
import Link from 'next/link';
import { RequestsItem } from '../../../services/request';

interface IProps {
  item: RequestsItem;
}
export default function SearchItem({ item }: IProps) {
  const imgSrc = item.images[0] ? item.images[0] : '/img/blank.png';

  return (
    <Link href={`/request/${item.id}`}>
      <a className={styles.container}>
        <div className={styles.image_wrapper}>
          <img src={imgSrc} />
        </div>
        <div className={styles.contents}>
          <div className={styles.info}>
            <p className={styles.location_time}>
              {item.suburb}, {item.district} | {UtilService.getDate(item.createdAt)}
            </p>
            <h3>{item.title}</h3>
            <p className={styles.detail}>{item.detail}</p>
          </div>
          <div>
            <p className={styles.pay}>${item.pay}.00</p>
          </div>
        </div>
      </a>
    </Link>
  );
}
