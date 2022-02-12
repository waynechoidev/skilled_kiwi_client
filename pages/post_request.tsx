import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/auth';
import { tokenState } from '../atoms/token';

export default function PostRequest() {
  const router = useRouter();
  const isAuthorized = useRecoilValue(authState);
  const token = useRecoilValue(tokenState);

  // me 메소드로 정보부터 받아오기
  console.log(token);
  console.log(isAuthorized);
  useEffect(() => {
    if (isAuthorized) {
    }
  }, [isAuthorized]);
  useEffect(() => {
    console.log(token);
  }, [token]);
  return <div>{isAuthorized ? <p>authorized</p> : <p>need signIn</p>}</div>;
}
