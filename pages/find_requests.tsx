import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../utils/common';
import styles from '../styles/find_requests.module.css';
import * as Data from '../data/request';

import SearchItem from '../components/find_requests/search_item';
import useForm from '../utils/hooks/use_form';
import SearchFilter from '../components/find_requests/search_filter';

interface IProps {
  urlBase: string;
}
export default function FindRequests({ urlBase }: IProps) {
  const [isHidingSearchTool, setIsHidingSearchTool] = useState(true);
  const [query, setQuery] = useState('');
  const { data, error } = useSWR<Data.RequestsItem[]>(() => `${urlBase}/jobs${query}`, fetcher);
  const { values, setValues, errors, handleChange, submitHandle } = useForm<Data.SearchValues, {}>({
    initialValues: {
      keyword: '',
      district: 'All Location',
      suburb: '',
      category: 'All Category',
    },
    onSubmit: (values) => {
      let newQuery: string = '';
      if (values.keyword) {
        newQuery += `&q=${values.keyword}`;
      }
      if (values.district != 'All Location') {
        newQuery += `&district=${values.district}`;
      }
      if (values.suburb != '') {
        newQuery += `&suburb=${values.suburb}`;
      }
      if (values.category != 'All Category') {
        newQuery += `&category=${values.category}`;
      }

      newQuery = newQuery.replace('&', '?');
      setQuery(newQuery);
    },
    validate: async () => ({}),
  });
  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <form className={styles.search_form} onSubmit={submitHandle}>
          <div className={styles.search_default}>
            <div className={styles.search_bar}>
              <img src="/img/search.svg" />
              <input
                placeholder="Search Keyword"
                value={values.keyword}
                name="keyword"
                onChange={handleChange()}
              />
            </div>
            <input className={styles.search_button} type="submit" value="Search" />
          </div>
          {!isHidingSearchTool && (
            <SearchFilter values={values} handleChange={handleChange} setValues={setValues} />
          )}
          <img
            className={styles.expand_button}
            src={isHidingSearchTool ? '/img/expand_more.svg' : '/img/expand_less.svg'}
            onClick={() => {
              setIsHidingSearchTool(!isHidingSearchTool);
            }}
          />
        </form>
        <div>
          {data.map((i) => (
            <SearchItem item={i} key={i.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
