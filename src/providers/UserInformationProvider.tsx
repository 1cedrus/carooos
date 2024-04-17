import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { ConversationInfo, Props } from '@/types.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import UserService from '@/services/UserService.ts';
import useAsync from '@/hooks/useAsync.ts';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';

export interface UserInformationContext {
  username?: string;
  elo?: number;
  friends?: string[];
  requests?: string[];
  games?: number[];
  conversations?: ConversationInfo[];
  setConversations: Dispatch<SetStateAction<ConversationInfo[]>>;
}

export const UserInformationContext = createContext<UserInformationContext>({} as UserInformationContext);

export const useUserInformationContext = () => {
  return useContext(UserInformationContext);
};

export default function UserInformationProvider({ children }: Props) {
  const { isAuthenticated, authToken } = useAuthenticationContext();
  const [username, setUsername] = useState<string>();
  const [elo, setElo] = useState<number>();
  const [friends, setFriends] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [games, setGames] = useState<number[]>([]);
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);

  const doFetchInfo = async () => {
    if (!isAuthenticated) return;

    const { username, elo, friends, requests, games, conversations } = await UserService.getUserInfo(authToken);

    setUsername(username);
    setElo(elo);
    setFriends(friends);
    setRequests(requests);
    setGames(games);
    setConversations(
      conversations.map((conversation: ConversationInfo) => ({
        ...conversation,
        peers: conversation.peers.filter((peer) => peer !== username),
      })),
    );
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
      value={{ username, elo, friends, requests, games, conversations, setConversations }}>
      {children}
    </UserInformationContext.Provider>
  );
}
