import { createContext, ReactChild, useEffect, useState } from 'react';
import AuthService, { AuthStatus } from '../services/auth/auth';

export interface AuthProviderValue extends AuthStatus {
  service: AuthService;
}
const authServiceInstance = AuthService.getInstance();
const initialStatus: AuthStatus = { token: '', isAuth: '' };
const initialValue: AuthProviderValue = { ...initialStatus, service: authServiceInstance };

export const authContext = createContext<AuthProviderValue>(initialValue);

interface IProps {
  children: ReactChild;
  urlBase: string;
}

const AuthProvider = ({ children, urlBase }: IProps) => {
  const [status, setStatus] = useState<AuthStatus>(initialStatus);

  const date = new Date();
  useEffect(() => {
    authServiceInstance?.init(urlBase, window, date, setStatus);
  }, []);

  const value = {
    service: authServiceInstance,
    token: status.token,
    isAuth: status.isAuth,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export default AuthProvider;
