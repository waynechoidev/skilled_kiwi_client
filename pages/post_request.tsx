import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/auth';
import { tokenState } from '../atoms/token';
import ErrorMessage from '../components/common/error_message';
import RequestInput from '../components/post_request/input';
import { jobCategoryList, RequestErrorValues, RequestValues } from '../data/post_request';
import useForm from '../utils/hooks/use_form';
import styles from '../styles/post_request.module.css';
import {
  detailFilter,
  submitRequest,
  titleFilter,
  uploadImage,
  validateSubmitRequest,
} from '../utils/post_request';
import { District, districtList, suburbMap } from '../data/user';

type Image = {
  file: File;
  name: string;
  size: string;
};
function calculateByte(bytes: number) {
  const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const e = Math.floor(Math.log(bytes) / Math.log(1024));

  if (!e) return '0 ' + s[0];
  else return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[e];
}

export default function PostRequest() {
  const isAuthorized = useRecoilValue(authState);
  const token = useRecoilValue(tokenState);
  const router = useRouter();

  const [imageError, setImageError] = useState('');
  const [images, setImages] = useState<Image[]>([]);

  const { values, setValues, errors, handleChange, submitHandle } = useForm<
    RequestValues,
    RequestErrorValues
  >({
    initialValues: {
      title: '',
      district: 'Auckland',
      suburb: 'Albany',
      category: 'repair',
      detail: '',
      images: [],
    },
    onSubmit: () => {
      const imageList: string[] = [];
      images.map(async (image) => {
        imageList.push(await uploadImage(image.file));
      });
      values.images = imageList;
      submitRequest(values, token);
    },
    validate: validateSubmitRequest,
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
          onChange={handleChange(titleFilter)}
          error={errors.title}
        />

        <h2>Location (closest district)</h2>
        <div className={styles.location}>
          <select
            name="district"
            value={values.district}
            onChange={(e) => {
              const newDistrict = e.target.value as District;
              setValues({
                ...values,
                district: newDistrict,
                suburb: suburbMap[newDistrict][0],
              });
            }}
          >
            {districtList.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select name="suburb" value={values.suburb} onChange={handleChange()}>
            {suburbMap[values.district].map((n) => (
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
            onChange={handleChange(detailFilter)}
          ></textarea>
          <ErrorMessage error={errors.detail} />
        </div>

        <h2>Category</h2>
        <select name="category" value={values.category} onChange={handleChange()}>
          {jobCategoryList.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <h2>Images to describe your request</h2>
        <div className={styles.image_upload}>
          <button>
            <label htmlFor="image_uploads">Upload (max file size: 10 MB)</label>
          </button>
          <ErrorMessage error={imageError} />
        </div>

        {images.map((img, i) => (
          <div className={styles.image_item} key={i}>
            <span className={styles.image_item_name}>{img.name}</span>
            <span className={styles.image_item_size}>{img.size}</span>{' '}
            <span
              className={styles.image_item_delete}
              onClick={() => {
                const newImages = [...images];
                newImages.splice(i, 1);
                setImages(newImages);
              }}
            >
              X
            </span>
          </div>
        ))}
        <input
          name="imgUpload"
          type="file"
          id="image_uploads"
          style={{ opacity: 0 }}
          maxLength={5}
          required={false}
          accept="image/*"
          onChange={async (e) => {
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
                const newImage: Image = { file, name: file.name, size: calculateByte(file.size) };
                setImages([...images, newImage]);
              }
            }
            e.target.value = '';
          }}
        />
        <div className={styles.submit_button_wrapper}>
          <input className={styles.submit_button} type="submit" value="Post Request" />
        </div>
      </form>
    </div>
  );
}
