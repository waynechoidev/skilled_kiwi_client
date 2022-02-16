import { District, Suburb } from './user';
export const jobCategoryList = [
  'car',
  'computer',
  'boat',
  'housekeeping',
  'language',
  'repair',
  'etc',
] as const;
export type JobCategory = typeof jobCategoryList[number];

export type RequestValues = {
  title: string;
  district: District;
  suburb: Suburb;
  category: JobCategory;
  detail: string;
  images: string[];
};
export type RequestErrorValues = {
  title?: string;
  detail?: string;
};
