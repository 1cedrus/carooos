import React, { createContext, SetStateAction, useContext, useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch.ts';
import { api } from '@/utils/api.ts';
import { Props } from '@/types.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import Snackbar from '@/components/custom/Snackbar.tsx';

export interface UserInformationContext {
  username?: string;
  elo?: number;
  friends?: string[];
  requests?: string[];
  setFriends: React.Dispatch<SetStateAction<string[] | undefined>>;
  setRequests: React.Dispatch<SetStateAction<string[] | undefined>>;
}

export const UserInformationContext = createContext<UserInformationContext>({} as UserInformationContext);

export const useUserInformationContext = () => {
  return useContext(UserInformationContext);
};

export default function UserInformationProvider({ children }: Props) {
  const fetch = useFetch();
  const { jsonWebToken, doLogout } = useAuthenticationContext();
  const [username, setUsername] = useState<string>();
  const [elo, setElo] = useState<number>();
  const [friends, setFriends] = useState<string[]>();
  const [requests, setRequests] = useState<string[]>();

  useEffect(() => {
    if (!jsonWebToken) return;

    (async () => {
      const response = await fetch(`${api.http}/api/user`);

      if (response.ok) {
        const { username, elo, friends, requests } = await response.json();

        setUsername(username);
        setElo(elo);
        setFriends(friends);
        setRequests(requests);
      } else {
        doLogout();
        setUsername('');
        setElo(0);
        setFriends([]);
        setRequests([]);
      }
    })();
  }, [jsonWebToken]);

  return (
    <UserInformationContext.Provider value={{ username, elo, friends, requests, setRequests, setFriends }}>
      <>
        {children}
        <Snackbar />
      </>
    </UserInformationContext.Provider>
  );
}
