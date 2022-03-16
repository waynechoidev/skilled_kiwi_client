import { District, Suburb } from '../user/user';

export type JobCategory = typeof RequestService.jobCategoryList[number];
export type RequestValues = {
  title: string;
  district: District;
  suburb: Suburb;
  category: JobCategory;
  detail: string;
  pay: number;
  images: string[];
};
export type RequestErrorValues = {
  title?: string;
  detail?: string;
};
export type RequestImage = {
  file: File;
  name: string;
  size: string;
};
export type RequestsItem = {
  id: number;
  title: string;
  district: string;
  suburb: string;
  category: string;
  detail: string;
  images: string[];
  createdAt: string;
  userId: number;
  username: string;
  pay: number;
};
export type SearchValues = {
  keyword: string;
  district: District | 'All Location';
  suburb: Suburb | '';
  category: JobCategory | 'All Category';
};

export default class RequestService {
  static jobCategoryList = [
    'car',
    'computer',
    'boat',
    'housekeeping',
    'language',
    'repair',
    'etc',
  ] as const;

  static titleFilter(title: string) {
    if (!title) {
      return 'Please fill up the title.';
    } else if (title.length < 10) {
      return 'Please enter at least 10 characters.';
    }
  }

  static detailFilter(detail: string) {
    if (!detail) {
      return 'Please fill up the detail.';
    } else if (detail.length < 20) {
      return 'Please enter at least 20 characters.';
    }
  }

  static async validateSubmitRequest(values: RequestValues) {
    const errors: RequestErrorValues = {};

    const titleError = RequestService.titleFilter(values.title);
    if (titleError) {
      errors.title = titleError;
    }

    const detailError = RequestService.detailFilter(values.detail);
    if (detailError) {
      errors.detail = detailError;
    }

    return errors;
  }

  static async uploadImage(file: File) {
    const formData = new FormData();
    formData.append(`file`, file);
    formData.append('upload_preset', 'unsigned');

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    const response: Promise<{ url: string }> = await fetch(
      'https://api.cloudinary.com/v1_1/waynethebb/upload',
      requestOptions
    ).then((res) => res.json());

    return (await response).url;
  }

  static handleSubmitConstructor(token: string, urlBase: string, push: Function) {
    return async (values: RequestValues) => {
      const result = await RequestService.postRequest(`${urlBase}/jobs`, values, token);
      if (result.id) {
        push(`/request/${result.id}`);
      }
    };
  }

  static async postRequest(url: string, values: RequestValues, token: string) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(values),
    };

    const response = await fetch(url, requestOptions);
    return response.json();
  }
  //TODO make return type for postRequest method
}
