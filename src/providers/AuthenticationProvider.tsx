import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';

interface AuthenticationContext {
  jsonWebToken: string;
  setJsonWebToken: (jwt: string) => void;
  isAuthenticated: boolean;
  doLogout: () => void;
  username?: string;
  elo?: number;
  friends?: string[];
  requests?: string[];
}

export const AuthenticationContext = createContext<AuthenticationContext>({} as AuthenticationContext);

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

export default function AuthenticationProvider({ children }: Props) {
  const [jsonWebToken, setJsonWebToken] = useState<string>(localStorage.getItem('jwt') || '');
  const isAuthenticated = !!jsonWebToken;

  useEffect(() => {
    if (!jsonWebToken) return;
    localStorage.setItem('jwt', jsonWebToken);
  }, [jsonWebToken]);

  const doLogout = () => {
    localStorage.removeItem('jwt');
    setJsonWebToken('');
  };

  return (
    <AuthenticationContext.Provider value={{ jsonWebToken, setJsonWebToken, isAuthenticated, doLogout }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
