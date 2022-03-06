import { createContext, ReactChild, useEffect, useState } from 'react';
import AuthService, { AuthStatus } from '../utils/modules/auth';

interface AuthProviderValue extends AuthStatus {
  service: AuthService;
}
const authServiceInstance = AuthService.getInstance();
const initialStatus: AuthStatus = { token: '', isAuth: '' };
const initialValue: AuthProviderValue = { ...initialStatus, service: authServiceInstance };

export const authContext = createContext<AuthProviderValue>(initialValue);

const AuthProvider = ({ children }: { children: ReactChild }) => {
  const [status, setStatus] = useState<AuthStatus>(initialStatus);

  const urlBase = 'http://localhost:8080';
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
