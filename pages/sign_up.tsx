import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import ErrorMessage from '../components/common/error_message/error_message';
import SignUpInput from '../components/sign_up/sign_up_input/sign_up_input';
import { authContext } from '../context/auth';
import useForm from '../hooks/use_form';
import SignUpService, { SignUpErrorValues, SignUpValues } from '../services/sign_up';
import UserService, { District } from '../services/user';
import styles from '../styles/sign_up.module.css';

interface IProps {
  urlBase: string;
}

export default function SignUp({ urlBase }: IProps) {
  const auth = useContext(authContext);
  const router = useRouter();
  const signUp = new SignUpService(urlBase, auth, router);
  const { values, setValues, errors, handleChange, submitHandle } = useForm<
    SignUpValues,
    SignUpErrorValues
  >({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthday: '1990-01-01',
      phoneNumberPrefix: '020',
      phoneNumber: '',
      district: 'Auckland',
      suburb: 'Albany',
    },
    onSubmit: signUp.handleSubmit,
    validate: signUp.validateSignUp,
  });

  const genderButton = (genderItem: 'male' | 'female' | 'diverse') => {
    return (
      <input
        type="radio"
        name="gender"
        value={genderItem}
        checked={values.gender === genderItem}
        onChange={handleChange()}
      />
    );
  };

  return (
    <div className={styles.container}>
      <h1>Create Account</h1>
      <form onSubmit={submitHandle}>
        <div className={styles.sub}>
          <h2>Account Details</h2>
          <h3>Username</h3>
          <p className={styles.desc}>Choose a username 6 - 20 characters long.</p>
          <SignUpInput
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange(signUp.usernameFilter)}
            error={errors.username}
          />

          <h3>Password</h3>
          <p className={styles.desc}>
            Choose a password 8 - 20 characters including at least a letter, a number and a special
            character (!@#$%^&*).
          </p>
          <SignUpInput
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange(signUp.passwordFilter)}
            error={errors.password}
          />

          <h3>Confirm Password</h3>
          <SignUpInput
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={(e) => {
              errors.password ||
                handleChange(signUp.confirmPasswordFilterConstructor(values.password))(e);
            }}
            error={errors.confirmPassword}
          />

          <h3>Email Address</h3>
          <SignUpInput
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange(signUp.emailFilter)}
            error={errors.email}
          />
        </div>
        <div className={styles.sub}>
          <h2>Contact Details</h2>
          <h3>First Name</h3>
          <SignUpInput
            type="text"
            name="firstName"
            value={values.firstName}
            onChange={handleChange()}
            error={errors.firstName}
          />

          <h3>Last Name</h3>
          <SignUpInput
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={handleChange()}
            error={errors.lastName}
          />

          <h3>Gender</h3>
          <div className={styles.gender_radio}>
            {genderButton('male')}
            <label>Male</label>
            {genderButton('female')}
            <label>Female</label>
            {genderButton('diverse')}
            <label>Gender Diverse</label>
          </div>
          <ErrorMessage error={errors.gender} />

          <h3>Date of Birth</h3>
          <SignUpInput
            type="date"
            name="birthday"
            value={values.birthday}
            onChange={handleChange()}
            error={errors.birthday}
          />

          <h3>Phone Number</h3>
          <div className={styles.phone_number}>
            <select
              name="phoneNumberPrefix"
              value={values.phoneNumberPrefix}
              onChange={handleChange()}
            >
              {UserService.phoneNumberPrefixList.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="1"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange()}
            />
          </div>
          <ErrorMessage error={errors.phoneNumber} />

          <h3>Location (closest district)</h3>
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
          <div className={styles.submit_button_wrapper}>
            <input className={styles.submit_button} type="submit" value="Create Your Account" />
          </div>
        </div>
      </form>
    </div>
  );
}
