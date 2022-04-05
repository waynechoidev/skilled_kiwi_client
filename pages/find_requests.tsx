import React, { useState } from 'react';
import useSWR from 'swr';
import styles from '../styles/find_requests.module.css';

import SearchItem from '../components/find_requests/search_item/search_item';
import useForm from '../hooks/use_form/use_form';
import SearchFilter from '../components/find_requests/search_filter/search_filter';
import { RequestsItem, SearchValues } from '../services/request/request';
import UtilService from '../services/util/util';
import ErrorRender from '../components/common/error_render/error_render';

interface IProps {
  urlBase: string;
}

export default function FindRequests({ urlBase }: IProps) {
  const [isHidingSearchTool, setIsHidingSearchTool] = useState(true);
  const [query, setQuery] = useState('');

  const { data, error } = useSWR<RequestsItem[]>(
    () => `${urlBase}/jobs${query}`,
    UtilService.fetcher
  );

  const { values, setValues, handleChange, submitHandle } = useForm<SearchValues, {}>({
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

  if (error) {
    return <ErrorRender message="Something Wrong" />;
  }
  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.spinner}>
            <img src="/img/spinner.gif" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <form className={styles.search_form} onSubmit={submitHandle}>
          <div className={styles.search_default}>
            <div className={styles.search_bar}>
              <img src="/img/icon/search.svg" />
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
            src={isHidingSearchTool ? '/img/icon/expand_more.svg' : '/img/icon/expand_less.svg'}
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
