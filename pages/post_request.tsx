import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/auth';
import { tokenState } from '../atoms/token';

export default function PostRequest() {
  const isAuthorized = useRecoilValue(authState);
  const token = useRecoilValue(tokenState);
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized === 'no') {
      router.push('/sign_in?back_to=post_request');
    }
  }, [isAuthorized]);
  return <div>hello</div>;
}
