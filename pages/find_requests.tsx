import React, { useEffect, useState } from 'react';
import RequestService from '../utils/modules/request';

interface IProps {
  requestService: RequestService;
}

export default function FindRequests() {
  const [requests, getRequests] = useState();
  useEffect(() => {}, []);

  return <div>FindRequests</div>;
}
