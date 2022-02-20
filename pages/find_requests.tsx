import React from 'react';
import useSWR from 'swr';
import { fetcher } from '../utils/common';

interface IProps {
  urlBase: string;
}

export default function FindRequests({ urlBase }: IProps) {
  const { data, error } = useSWR(`${urlBase}/jobs`, fetcher);
  console.log(data);

  return <div>FindRequests</div>;
}
