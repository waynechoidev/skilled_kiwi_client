export const phoneNumberPrefixList = [
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

export const districtList = [
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
export const suburbMap = {
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

export type Suburb = typeof suburbMap[District][number];
export type District = typeof districtList[number];

export type SignUpValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'diverse' | '';
  birthday: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
  district: District;
  suburb: Suburb;
};
export type SignUpErrorValues = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthday?: string;
  phoneNumberPrefix?: string;
  phoneNumber?: string;
  district?: string;
  suburb?: string;
};
