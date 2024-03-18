import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';
import AuthService, { Credential } from '@/services/AuthService.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';

interface AuthenticationContext {
  authToken: string;
  isAuthenticated: boolean;
  doSignIn: (credential: Credential) => Promise<void>;
  doSignUp: (registerCredential: Credential) => Promise<void>;
  doLogout: () => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({} as AuthenticationContext);

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

export default function AuthenticationProvider({ children }: Props) {
  const [authToken, setAuthToken] = useState<string>(localStorage.getItem('authToken') || '');

  useEffect(() => {
    localStorage.setItem('authToken', authToken);
  }, [authToken]);

  const doSignIn = async (credential: Credential) => {
    try {
      setAuthToken((await AuthService.signIn(credential)).token);
    } catch (_) {
      triggerEvent(EventName.OpenInforSnackBar, 'userz or password is wrong!');
    }
  };

  const doSignUp = async (registerCredential: Credential) => {
    try {
      setAuthToken((await AuthService.signUp(registerCredential)).token);
    } catch (_) {
      triggerEvent(EventName.OpenInforSnackBar, 'userz or password is wrong!');
    }
  };

  const doLogout = () => {
    setAuthToken('');
  };

  const isAuthenticated = !!authToken;

  return (
    <AuthenticationContext.Provider value={{ doSignIn, doSignUp, doLogout, authToken, isAuthenticated }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
