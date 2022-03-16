import React from 'react';
import RequestService, { SearchValues } from '../../../services/request/request';
import UserService, { District } from '../../../services/user/user';
import styles from './search_filter.module.css';

interface IProps {
  values: SearchValues;
  handleChange: Function;
  setValues: Function;
}

export default function SearchFilter({ values, handleChange, setValues }: IProps) {
  return (
    <div className={styles.container}>
      <select name="category" value={values.category} onChange={handleChange()}>
        <option>All Category</option>
        {RequestService.jobCategoryList.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <select
        name="district"
        value={values.district}
        onChange={(e) => {
          const newDistrict = e.target.value as District | 'All Location';
          setValues({
            ...values,
            district: newDistrict,
            suburb: newDistrict != 'All Location' ? UserService.suburbMap[newDistrict][0] : '',
          });
        }}
      >
        <option>All Location</option>
        {UserService.districtList.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {values.district != 'All Location' ? (
        <select name="suburb" value={values.suburb} onChange={handleChange()}>
          {UserService.suburbMap[values.district].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      ) : (
        <select disabled />
      )}
    </div>
  );
}
