import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import UserService from '@/services/UserService.ts';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { toast } from 'react-toastify';
import { IMAGE_URL } from '@/utils/api.ts';
import { useAsync } from 'react-use';

export interface UserInformationContext {
  username?: string;
  elo?: number;
  profilePicUrl?: string;
  currentGame: string;
  setCurrentGame: Dispatch<SetStateAction<string>>;
  email?: string;
}

export const UserInformationContext = createContext<UserInformationContext>({} as UserInformationContext);

export const useUserInformationContext = () => {
  return useContext(UserInformationContext);
};

export default function UserInformationProvider({ children }: Props) {
  const { authToken, doLogout } = useAuthenticationContext();
  const [username, setUsername] = useState<string>();
  const [elo, setElo] = useState<number>();
  const [currentGame, setCurrentGame] = useState<string>('');
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');
  const [email, setEmail] = useState<string>();

  const doFetchInfo = async () => {
    if (!authToken) return;

    try {
      const { username, elo, currentGame, profilePicUrl, email } = await UserService.getUserInfo(authToken);

      setUsername(username);
      setElo(elo);
      setCurrentGame(currentGame);
      setProfilePicUrl(`${IMAGE_URL}/${profilePicUrl}`);
      setEmail(email);
    } catch (e) {
      toast.error('Some errors occurred while fetching user information');

      doLogout();
    }
  };

  useAsync(async () => {
    if (!authToken) {
      setUsername('');
      setElo(0);
      setEmail('');
      setCurrentGame('');
      setProfilePicUrl('');
      return;
    }

    await doFetchInfo();
  }, [authToken]);

  useEffect(() => {
    eventEmitter.on(EventName.ReloadInfo, async () => await doFetchInfo());

    return () => {
      eventEmitter.off(EventName.ReloadInfo, async () => await doFetchInfo());
    };
  }, [authToken]);

  return (
    <UserInformationContext.Provider
      value={{
        username,
        elo,
        currentGame,
        setCurrentGame,
        profilePicUrl,
        email,
      }}>
      {children}
    </UserInformationContext.Provider>
  );
}
