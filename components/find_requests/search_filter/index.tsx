import React from 'react';
import * as Data from '../../../data/request';
import * as UserData from '../../../data/user';
import styles from './style.module.css';

interface IProps {
  values: Data.SearchValues;
  handleChange: Function;
  setValues: Function;
}

export default function SearchFilter({ values, handleChange, setValues }: IProps) {
  return (
    <div className={styles.container}>
      <select name="category" value={values.category} onChange={handleChange()}>
        <option>All Category</option>
        {Data.jobCategoryList.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <select
        name="district"
        value={values.district}
        onChange={(e) => {
          const newDistrict = e.target.value as UserData.District | 'All Location';
          setValues({
            ...values,
            district: newDistrict,
            suburb: newDistrict != 'All Location' ? UserData.suburbMap[newDistrict][0] : '',
          });
        }}
      >
        <option>All Location</option>
        {UserData.districtList.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {values.district != 'All Location' ? (
        <select name="suburb" value={values.suburb} onChange={handleChange()}>
          {UserData.suburbMap[values.district].map((n) => (
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
