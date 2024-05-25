import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';
import AuthService, { Credential, RegisterCredential } from '@/services/AuthService.ts';
import { toast } from 'react-toastify';

interface AuthenticationContext {
  authToken: string;
  isAuthenticated: boolean;
  doSignIn: (credential: Credential) => Promise<void>;
  doSignUp: (registerCredential: RegisterCredential) => Promise<void>;
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
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const doSignUp = async (registerCredential: RegisterCredential) => {
    try {
      setAuthToken((await AuthService.signUp(registerCredential)).token);
    } catch (e) {
      toast.error((e as Error).message);
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
