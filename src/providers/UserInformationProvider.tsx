import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { ConversationInfo, Props } from '@/types.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import UserService from '@/services/UserService.ts';
import useAsync from '@/hooks/useAsync.ts';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { toast } from 'react-toastify';
import { IMAGE_URL } from '@/utils/api.ts';

export interface UserInformationContext {
  username?: string;
  elo?: number;
  friends?: string[];
  requests?: string[];
  conversations?: ConversationInfo[];
  profilePicUrl?: string;
  setConversations: Dispatch<SetStateAction<ConversationInfo[]>>;
  currentGame: string;
  setCurrentGame: Dispatch<SetStateAction<string>>;
}

export const UserInformationContext = createContext<UserInformationContext>({} as UserInformationContext);

export const useUserInformationContext = () => {
  return useContext(UserInformationContext);
};

export default function UserInformationProvider({ children }: Props) {
  const { isAuthenticated, authToken, doLogout } = useAuthenticationContext();
  const [username, setUsername] = useState<string>();
  const [elo, setElo] = useState<number>();
  const [friends, setFriends] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [currentGame, setCurrentGame] = useState<string>('');
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');

  const doFetchInfo = async () => {
    if (!isAuthenticated) return;

    try {
      const { username, elo, friends, requests, conversations, currentGame, profilePicUrl } =
        await UserService.getUserInfo(authToken);

      setUsername(username);
      setElo(elo);
      setFriends(friends);
      setRequests(requests);
      setCurrentGame(currentGame);
      setProfilePicUrl(`${IMAGE_URL}/${profilePicUrl}`);
      setConversations(
        conversations.map((conversation: ConversationInfo) => ({
          ...conversation,
          peers: conversation.peers.filter((peer) => peer !== username),
        })),
      );
    } catch (e) {
      toast.error('Some errors occurred while fetching user information');

      doLogout();
    }
  };

  useAsync(async () => {
    if (!isAuthenticated) {
      setUsername('');
      setElo(0);
      setFriends([]);
      setRequests([]);
      return;
    }

    await doFetchInfo();
  }, [isAuthenticated]);

  useEffect(() => {
    eventEmitter.on(EventName.ReloadInfo, async () => await doFetchInfo());

    return () => {
      eventEmitter.off(EventName.ReloadInfo, async () => await doFetchInfo());
    };
  }, []);

  return (
    <UserInformationContext.Provider
      value={{
        username,
        elo,
        friends,
        requests,
        conversations,
        setConversations,
        currentGame,
        setCurrentGame,
        profilePicUrl,
      }}>
      {children}
    </UserInformationContext.Provider>
  );
}
