//ToDO
//set routing after submit
//refactor logic to modularize

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/auth';
import { tokenState } from '../atoms/token';
import ErrorMessage from '../components/common/error_message';
import RequestInput from '../components/post_request/input';
import * as Data from '../data/post_request';
import useForm from '../utils/hooks/use_form';
import styles from '../styles/post_request.module.css';
import * as Utils from '../utils/post_request';
import * as UserData from '../data/user';
import RequestService from '../utils/modules/request';
import { calculateByte } from '../utils/common';

interface IProps {
  request: RequestService;
}

export default function PostRequest({ request }: IProps) {
  const isAuthorized = useRecoilValue(authState);
  const token = useRecoilValue(tokenState);
  const router = useRouter();

  const [imageError, setImageError] = useState('');
  const [isImageLoading, setIsImageUploading] = useState(false);
  const [images, setImages] = useState<Data.Image[]>([]);

  const { values, setValues, errors, handleChange, submitHandle } = useForm<
    Data.RequestValues,
    Data.RequestErrorValues
  >({
    initialValues: {
      title: '',
      district: 'Auckland',
      suburb: 'Albany',
      category: 'repair',
      detail: '',
      images: [],
    },
    onSubmit: async () => {
      const result = await request.postRequest(values, token);
      console.log(result);
    },
    validate: Utils.validateSubmitRequest,
  });
  useEffect(() => {
    if (isAuthorized === 'no') {
      router.push('/sign_in?back_to=post_request');
    }
  }, [isAuthorized]);

  return (
    <div className={styles.container}>
      <h1>You can make a request</h1>
      <p className={styles.desc}>
        Contact skilled kiwis. You can view their profiles, ratings and chat with them.
      </p>
      <form className={styles.form} onSubmit={submitHandle}>
        <h2>Choose a name for your request</h2>
        <RequestInput
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange(Utils.titleFilter)}
          error={errors.title}
        />

        <h2>Location (closest district)</h2>
        <div className={styles.location}>
          <select
            name="district"
            value={values.district}
            onChange={(e) => {
              const newDistrict = e.target.value as UserData.District;
              setValues({
                ...values,
                district: newDistrict,
                suburb: UserData.suburbMap[newDistrict][0],
              });
            }}
          >
            {UserData.districtList.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select name="suburb" value={values.suburb} onChange={handleChange()}>
            {UserData.suburbMap[values.district].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <h2>Tell us more about your request</h2>
        <div className={styles.textarea_wrapper}>
          <textarea
            name="detail"
            value={values.detail}
            onChange={handleChange(Utils.detailFilter)}
          ></textarea>
          <ErrorMessage error={errors.detail} />
        </div>

        <h2>Category</h2>
        <select name="category" value={values.category} onChange={handleChange()}>
          {Data.jobCategoryList.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <h2>Images to describe your request</h2>
        <div className={styles.image_upload}>
          <label htmlFor="image_uploads">Upload (max file size: 10 MB)</label>
          <ErrorMessage error={imageError} />
        </div>

        {images.map((img, i) => (
          <div className={styles.image_item} key={i}>
            <span className={styles.image_item_name}>{img.name}</span>
            <span className={styles.image_item_size}>{img.size}</span>
            <span
              className={styles.image_item_delete}
              onClick={async () => {
                const newImages = [...images];
                newImages.splice(i, 1);
                setImages(newImages);
              }}
            >
              X
            </span>
          </div>
        ))}
        {isImageLoading && (
          <div className={styles.spinner}>
            <img src="/img/spinner.gif" />
          </div>
        )}
        <input
          name="imgUpload"
          type="file"
          id="image_uploads"
          style={{ opacity: 0 }}
          maxLength={5}
          required={false}
          accept="image/*"
          onChange={async (e) => {
            e.preventDefault();
            setIsImageUploading(true);
            const file = e.target.files![0];
            if (file) {
              if (images.find((x) => x.name === file.name)) {
                setImageError('It has already been added.');
              } else if (file.size > 10485760) {
                setImageError('File size is too big.');
              } else if (file.type.search('image') === -1) {
                setImageError('It is not an image.');
              } else if (images.length >= 5) {
                setImageError('Max number of image is 5.');
              } else {
                setImageError('');
                const newImage: Data.Image = {
                  file,
                  name: file.name,
                  size: calculateByte(file.size),
                };
                values.images = [...values.images, await Utils.uploadImage(file)];
                setImages([...images, newImage]);
              }
            }
            e.target.value = '';
            setIsImageUploading(false);
          }}
        />
        <div className={styles.submit_button_wrapper}>
          <input className={styles.submit_button} type="submit" value="Post Request" />
        </div>
      </form>
    </div>
  );
}
