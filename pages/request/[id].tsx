import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from '../../styles/request.module.css';
import Link from 'next/link';
import UtilService from '../../services/util/util';
import { RequestsItem } from '../../services/request/request';
import { authContext } from '../../context/auth/auth';
interface IProps {
  urlBase: string;
}
export default function Request({ urlBase }: IProps) {
  const fetcher = async (url: string) => fetch(url).then((res) => res.json());
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR<RequestsItem>(() => `${urlBase}/jobs/${id}`, fetcher);

  const auth = useContext(authContext);
  useEffect(() => {
    if (auth.isAuth === 'yes') {
      const userId = auth.service.getUserId();
      setIsAuth(userId == data?.userId);
    }
  }, [auth, data]);
  //Now Response of userId for signIn is string, but one for getJob is number.
  //Fix it later (=== than ==)

  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';
  return (
    <div className={styles.container}>
      <div className={styles.subject_wrapper}>
        <div className={styles.subject}>
          <h2>{data.title}</h2>
          <p>${data.pay}</p>
        </div>
      </div>
      <div className={styles.links}>
        <Link href={'/'}>
          <a>SkilledKiwi</a>
        </Link>
        <span> / </span>
        <Link href={'/find_requests'}>
          <a>Find Requests</a>
        </Link>
        <span> / </span>
        <Link href={`request/${id}`}>
          <a>{data.title}</a>
        </Link>
      </div>
      <div className={styles.contents}>
        <div className={styles.box}>
          <p>{data.detail}</p>
          <div className={styles.info}>
            <p>
              <b>Listed: </b>
              {UtilService.getDateAndTime(data.createdAt)}
            </p>
            <p>
              <b>Category: </b>
              {data.category}
            </p>
            <p>
              <b>Location: </b>
              {data.suburb}, {data.district}
            </p>
            <p>
              <b>Request ID: </b>#{data.id}
            </p>
          </div>
          {data.images[0] && (
            <div className={styles.image_wrapper}>
              {data.images.map((img, index) => (
                <img key={index} src={img} />
              ))}
            </div>
          )}
        </div>
        <div className={`${styles.box} ${styles.employer}`}>
          <h3>About Employer</h3>
          <hr />
          <p>
            <b>Username: </b>
            {data.username}
          </p>
          <p>
            <b>Member Since: </b>
            {UtilService.getDateAndYear(data.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
