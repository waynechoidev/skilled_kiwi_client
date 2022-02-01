import React, { useState } from 'react';
import AuthService from '../service/auth';
import styles from '../styles/sign_up.module.css';

interface IProps {
  auth: AuthService;
}

export default function SignUp({ auth }: IProps) {
  const numberPrefixList = [
    '020',
    '021',
    '022',
    '027',
    '028',
    '029',
    '03',
    '04',
    '06',
    '07',
    '09',
  ] as const;

  const districtList = [
    'Auckland',
    'Northland',
    'Waikato',
    'Bay of Plenty',
    'Gisborne',
    "Hawke's Bay",
    'Taranaki',
    'Whanganui',
    'Manawatu',
    'Wairarapa',
    'Wellington',
    'Nelson Bays',
    'Marlborough',
    'West Coast',
    'Canterbury',
    'Timaru - Oamaru',
    'Otago',
    'Southland',
  ] as const; // make the array read only to make a type District

  const suburbMap = {
    'Auckland': [
      'Albany',
      'Auckland City',
      'Botany Downs',
      'Clevedon',
      'Franklin',
      'Great Barrier Island',
      'Helensville',
      'Henderson',
      'Hibiscus Coast',
      'Kumeu',
      'Mangere',
      'Manukau',
      'New Lynn',
      'North Shore',
      'Onehunga',
      'Papakura',
      'Pukekohe',
      'Remuera',
      'Waiheke Island',
      'Waitakere',
      'Waiuku',
      'Warkworth',
      'Wellsford',
    ],
    'Northland': [
      'Dargaville',
      'Kaikohe',
      'Kaitaia',
      'Kawakawa',
      'Kerikeri',
      'Mangawhai',
      'Maungaturoto',
      'Paihia',
      'Whangarei',
    ],

    'Waikato': [
      'Cambridge',
      'Coromandel',
      'Hamilton',
      'Huntly',
      'Matamata',
      'Morrinsville',
      'Ngaruawahia',
      'Ngatea',
      'Otorohanga',
      'Paeroa',
      'Raglan',
      'Taumarunui',
      'Taupo',
      'Te Awamutu',
      'Te Kuiti',
      'Thames',
      'Tokoroa/Putaruru',
      'Turangi',
      'Waihi',
      'Whangamata',
      'Whitianga',
    ],
    'Bay of Plenty': [
      'Katikati',
      'Kawerau',
      'Mt. Maunganui',
      'Opotiki',
      'Papamoa',
      'Rotorua',
      'Tauranga',
      'Te Puke',
      'Waihi Beach',
      'Whakatane',
    ],
    'Gisborne': ['Gisborne', 'Ruatoria'],
    "Hawke's Bay": ['Hastings', 'Napier', 'Waipukurau', 'Wairoa'],
    'Taranaki': ['Hawera', 'Mokau', 'New Plymouth', 'Opunake', 'Stratford'],
    'Whanganui': ['Ohakune', 'Taihape', 'Waiouru', 'Whanganui'],
    'Manawatu': [
      'Bulls',
      'Dannevirke',
      'Feilding',
      'Levin',
      'Manawatu',
      'Marton',
      'Pahiatua',
      'Palmerston North',
      'Woodville',
    ],
    'Wairarapa': ['Carterton', 'Featherston', 'Greytown', 'Martinborough', 'Masterton'],
    'Wellington': ['Kapiti', 'Lower Hutt City', 'Porirua', 'Upper Hutt City', 'Wellington City'],
    'Nelson Bays': ['Golden Bay', 'Motueka', 'Murchison', 'Nelson'],
    'Marlborough': ['Blenheim', 'Marlborough Sounds', 'Picton'],
    'West Coast': ['Greymouth', 'Hokitika', 'Westport'],
    'Canterbury': [
      'Akaroa',
      'Amberley',
      'Ashburton',
      'Belfast',
      'Cheviot',
      'Christchurch City',
      'Darfield',
      'Fairlie',
      'Ferrymead',
      'Geraldine',
      'Halswell',
      'Hanmer Springs',
      'Kaiapoi',
      'Kaikoura',
      'Lyttelton',
      'Mt Cook',
      'Rangiora',
      'Rolleston',
      'Selwyn',
    ],
    'Timaru - Oamaru': ['Kurow', 'Oamaru', 'Timaru', 'Twizel', 'Waimate'],
    'Otago': [
      'Alexandra',
      'Balclutha',
      'Cromwell',
      'Dunedin',
      'Lawrence',
      'Milton',
      'Palmerston',
      'Queenstown',
      'Ranfurly',
      'Roxburgh',
      'Tapanui',
      'Wanaka',
    ],
    'Southland': [
      'Bluff',
      'Edendale',
      'Gore',
      'Invercargill',
      'Lumsden',
      'Otautau',
      'Riverton',
      'Stewart Island',
      'Te Anau',
      'Tokanui',
      'Winton',
    ],
  } as const;

  type District = typeof districtList[number];

  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('1990-01-01');
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('020');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState<District>('Auckland');
  const [suburb, setSuburb] = useState('');

  console.log(isUsernameValid);

  return (
    <div className={styles.container}>
      <h1>Create Account</h1>
      <form>
        <div className={styles.sub}>
          <h2>Account Details</h2>
          <h3>Username</h3>
          <p>Choose a username 6 – 30 characters long.</p>
          <input
            type="username"
            name="username"
            value={username}
            onChange={(e) => {
              const currentValue = e.target.value;
              setUsername(currentValue);
              setTimeout(async () => {
                if (currentValue.length >= 6 && currentValue.length <= 30) {
                  setIsUsernameValid(await auth.checkValidUsername(currentValue));
                } else {
                  setIsUsernameValid(false);
                }
              }, 500);
            }}
            className={styles.input_box}
          />
          {username.length > 0 && (isUsernameValid ? 'O' : 'X')}
          <h3>Password</h3>
          <p>
            Choose a password at least 15 characters OR at least 8 characters including a number and
            a letter.
          </p>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={styles.input_box}
          />
          <h3>Confirm Password</h3>
          <input
            type="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            className={styles.input_box}
          />
          <h3>Email Address</h3>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className={styles.input_box}
          />
        </div>
        <div className={styles.sub}>
          <h2>Contact Details</h2>
          <h3>First Name</h3>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className={styles.input_box}
          />
          <h3>Last Name</h3>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className={styles.input_box}
          />
          <h3>Gender</h3>
          <div className={styles.gender_radio}>
            <input
              type="radio"
              name="gender"
              checked={gender === 'male'}
              onChange={() => {
                setGender('male');
              }}
            />
            <label>Male</label>
            <input
              type="radio"
              name="gender"
              checked={gender === 'female'}
              onChange={() => {
                setGender('female');
              }}
            />
            <label>Female</label>
            <input
              type="radio"
              name="gender"
              checked={gender === 'diverse'}
              onChange={() => {
                setGender('diverse');
              }}
            />
            <label>Gender Diverse</label>
          </div>
          <h3>Date of Birth</h3>
          <input
            type="date"
            name="birthday"
            value={birthday}
            onChange={(e) => {
              setBirthday(e.target.value);
            }}
            className={styles.input_box}
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
              type="text"
              name="number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>
          <h3>Location (closest district)</h3>
          <div className={styles.location}>
            <select
              name="district"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value! as District);
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
        </div>
      </form>
    </div>
  );
}
