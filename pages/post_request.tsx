//ToDO
//set routing after submit
//refactor logic to modularize
//Modularize request

import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import ErrorMessage from '../components/common/error_message/error_message';
import useForm from '../hooks/use_form';
import styles from '../styles/post_request.module.css';

import UtilService from '../services/util';
import { authContext } from '../context/auth';
import Input from '../components/common/input/input';
import RequestService, {
  RequestErrorValues,
  RequestImage,
  RequestValues,
} from '../services/request';
import UserService, { District } from '../services/user';

export default function PostRequest() {
  const urlBase = 'adf';
  const auth = useContext(authContext);
  const { isAuth, token } = auth;
  const router = useRouter();

  const [imageError, setImageError] = useState('');
  const [isImageLoading, setIsImageUploading] = useState(false);
  const [images, setImages] = useState<RequestImage[]>([]);

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
    onSubmit: async () => {
      const result = await RequestService.postRequest(`${urlBase}/jobs`, values, token);
      console.log(result);
    },
    validate: RequestService.validateSubmitRequest,
  });
  useEffect(() => {
    if (isAuth === 'no') {
      router.push('/sign_in?back_to=post_request');
    }
  }, [isAuth]);

  return (
    <div className={styles.container}>
      <h1>You can make a request</h1>
      <p className={styles.desc}>
        Contact skilled kiwis. You can view their profiles, ratings and chat with them.
      </p>
      <form className={styles.form} onSubmit={submitHandle}>
        <h2>Choose a name for your request</h2>
        <Input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange(RequestService.titleFilter)}
        />
        <ErrorMessage error={errors.title} />

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
                suburb: UserService.suburbMap[newDistrict][0],
              });
            }}
          >
            {UserService.districtList.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select name="suburb" value={values.suburb} onChange={handleChange()}>
            {UserService.suburbMap[values.district].map((n) => (
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
            onChange={handleChange(RequestService.detailFilter)}
          ></textarea>
          <ErrorMessage error={errors.detail} />
        </div>

        <h2>Category</h2>
        <select name="category" value={values.category} onChange={handleChange()}>
          {RequestService.jobCategoryList.map((n) => (
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
                const newImage: RequestImage = {
                  file,
                  name: file.name,
                  size: UtilService.calculateByte(file.size),
                };
                values.images = [...values.images, await RequestService.uploadImage(file)];
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
