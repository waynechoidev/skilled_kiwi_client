import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  districtList,
  numberPrefixList,
  suburbMap,
  District,
  CompulsoryParameter,
} from '../data/sign_up';
import AuthService from '../service/auth';
import {
  confirmPasswordFilterConstructor,
  emailFilterConstructor,
  handleSubmitConstructor,
  inputHandlerConstructor,
  passwordFilter,
  usernameFilterConstructor,
} from '../service/sign_up';
import styles from '../styles/sign_up.module.css';
interface IProps {
  auth: AuthService;
}

export default function SignUp({ auth }: IProps) {
  // Variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'diverse' | ''>('');
  const [birthday, setBirthday] = useState('1990-01-01');
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('020');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState<District>('Auckland');
  const [suburb, setSuburb] = useState('Albany');

  const [isSubmitValid, setIsSubmitValid] = useState(true);
  const [isError, setIsError] = useState<CompulsoryParameter[]>([]);

  //Sanitizers
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);

  const router = useRouter();

  const handleSubmit = handleSubmitConstructor(
    username,
    password,
    email,
    firstName,
    lastName,
    gender,
    birthday,
    phoneNumberPrefix,
    phoneNumber,
    district,
    suburb,
    isUsernameValid,
    isPasswordValid,
    isConfirmPasswordValid,
    isEmailValid,
    auth,
    setIsError,
    setIsSubmitValid,
    router
  );

  const isValid = (item: string, validChecker: boolean) => {
    if (item.length > 0) {
      return (
        <img className={styles.valid_icon} src={validChecker ? '/img/yes.svg' : '/img/no.svg'} />
      );
    }
  };

  const genderButton = (genderItem: 'male' | 'female' | 'diverse') => {
    return (
      <input
        type="radio"
        name="gender"
        value={gender}
        checked={gender === genderItem}
        onChange={() => {
          setGender(genderItem);
        }}
      />
    );
  };

  const checkError = (i: CompulsoryParameter) => {
    return isError.indexOf(i) != -1;
  };

  return (
    <div className={styles.container}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.sub}>
          <h2>Account Details</h2>

          <h3>Username</h3>
          <p className={styles.desc}>Choose a username 6 - 20 characters long.</p>
          <div className={styles.input_wrapper}>
            <input
              className={styles.text_input}
              type="text"
              name="username"
              value={username}
              onChange={inputHandlerConstructor(
                setUsername,
                setIsUsernameValid,
                usernameFilterConstructor(auth, setIsUsernameUnique)
              )}
            />
            {isValid(username, isUsernameValid)}
          </div>
          {isUsernameUnique || <p className={styles.error}>Username is already exist.</p>}
          {checkError('username') && isUsernameUnique && (
            <p className={styles.error}>Username is not valid.</p>
          )}

          <h3>Password</h3>
          <p className={styles.desc}>
            Choose a password 8 - 20 characters including at least a letter, a number and a special
            character (!@#$%^&*).
          </p>
          <div className={styles.input_wrapper}>
            <input
              className={styles.text_input}
              type="password"
              name="password"
              value={password}
              onChange={inputHandlerConstructor(setPassword, setIsPasswordValid, passwordFilter)}
            />
            {isValid(password, isPasswordValid)}
          </div>
          {checkError('password') && <p className={styles.error}>Password is not valid.</p>}

          <h3>Confirm Password</h3>
          <div className={styles.input_wrapper}>
            <input
              className={styles.text_input}
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={inputHandlerConstructor(
                setConfirmPassword,
                setIsConfirmPasswordValid,
                confirmPasswordFilterConstructor(isPasswordValid, password)
              )}
            />
            {isValid(confirmPassword, isConfirmPasswordValid)}
          </div>
          {checkError('confirmPassword') && (
            <p className={styles.error}>Confirm Password is not valid.</p>
          )}

          <h3>Email Address</h3>
          <div className={styles.input_wrapper}>
            <input
              className={styles.text_input}
              type="text"
              name="email"
              value={email}
              onChange={inputHandlerConstructor(
                setEmail,
                setIsEmailValid,
                emailFilterConstructor(auth, setIsEmailUnique)
              )}
            />
            {isValid(email, isEmailValid)}
          </div>
          {isEmailUnique || <p className={styles.error}>Email Address is already exist.</p>}
          {checkError('email') && isEmailUnique && (
            <p className={styles.error}>Email Address is not valid.</p>
          )}
        </div>
        <div className={styles.sub}>
          <h2>Contact Details</h2>
          <h3>First Name</h3>
          <input
            className={styles.text_input}
            type="text"
            name="firstName"
            value={firstName}
            onChange={inputHandlerConstructor(setFirstName)}
          />
          {checkError('firstName') && <p className={styles.error}>First Name is not valid.</p>}

          <h3>Last Name</h3>
          <input
            className={styles.text_input}
            type="text"
            name="lastName"
            value={lastName}
            onChange={inputHandlerConstructor(setLastName)}
          />
          {checkError('lastName') && <p className={styles.error}>Last Name is not valid.</p>}

          <h3>Gender</h3>
          <div className={styles.gender_radio}>
            {genderButton('male')}
            <label>Male</label>
            {genderButton('female')}
            <label>Female</label>
            {genderButton('diverse')}
            <label>Gender Diverse</label>
          </div>
          {checkError('gender') && <p className={styles.error}>Gender is not valid.</p>}

          <h3>Date of Birth</h3>
          <input
            className={styles.text_input}
            type="date"
            name="birthday"
            value={birthday}
            onChange={(e) => {
              setBirthday(e.target.value);
            }}
          />
          <h3>Phone Number</h3>
          <div className={styles.phone_number}>
            <select
              name="numberPrefix"
              value={phoneNumberPrefix}
              onChange={(e) => {
                setPhoneNumberPrefix(e.target.value);
              }}
            >
              {numberPrefixList.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="1"
              name="number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.toString());
              }}
            />
          </div>
          {checkError('phoneNumber') && <p className={styles.error}>Phone Number is not valid.</p>}

          <h3>Location (closest district)</h3>
          <div className={styles.location}>
            <select
              name="district"
              value={district}
              onChange={(e) => {
                const districtValue = e.target.value! as District;
                setDistrict(districtValue);
                setSuburb(suburbMap[districtValue][0]);
              }}
            >
              {districtList.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <select
              name="suburb"
              value={suburb}
              onChange={(e) => {
                setSuburb(e.target.value);
              }}
            >
              {suburbMap[district].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.submit_button_wrapper}>
            <input className={styles.submit_button} type="submit" value="Create Your Account" />
            {isSubmitValid || <img className={styles.valid_icon} src="/img/no.svg" />}
          </div>
        </div>
      </form>
    </div>
  );
}
