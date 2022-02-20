import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../../../atoms/auth';
import { tokenState } from '../../../atoms/token';
import AuthService from '../../../utils/modules/auth';

interface IProps {
  authService: AuthService;
  date: Date;
}

export default function Initializer({ authService, date }: IProps) {
  const [token, setToken] = useRecoilState(tokenState);
  const [isAuthorized, setIsAuthorized] = useRecoilState(authState);
  useEffect(() => {
    authService.init(setToken, setIsAuthorized, window, date);
  }, []);
  return <></>;
}
