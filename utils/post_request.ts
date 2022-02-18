import { RequestErrorValues, RequestValues } from './../data/post_request';

export async function submitRequest(values: RequestValues, token: string) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(values),
  };

  const response = await fetch('http://localhost:8080/jobs', requestOptions);
  return response.json();
}

export function titleFilter(title: string) {
  if (!title) {
    return 'Please fill up the title.';
  } else if (title.length < 10) {
    return 'Please enter at least 10 characters.';
  }
}
export function detailFilter(detail: string) {
  if (!detail) {
    return 'Please fill up the detail.';
  } else if (detail.length < 20) {
    return 'Please enter at least 20 characters.';
  }
}
export async function validateSubmitRequest(values: RequestValues) {
  const errors: RequestErrorValues = {};

  const titleError = titleFilter(values.title);
  if (titleError) {
    errors.title = titleError;
  }

  const detailError = detailFilter(values.detail);
  if (detailError) {
    errors.detail = detailError;
  }

  return errors;
}

export async function uploadImage(file: File) {
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
