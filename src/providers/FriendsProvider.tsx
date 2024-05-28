import { createContext, useContext, useEffect, useState } from 'react';
import { FriendInformation, FriendsMessage, FriendsMessageType, Props, UserFriendData } from '@/types.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import FriendsService from '@/services/FriendsService.ts';
import { eventEmitter, EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { topics } from '@/utils/topics.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

interface FriendsContext {
  friends?: FriendInformation[];
  requests?: string[];
}

export const FriendsContext = createContext<FriendsContext>({} as FriendsContext);

export const useFriendsContext = () => {
  return useContext(FriendsContext);
};

export default function FriendsProvider({ children }: Props) {
  const { authToken } = useAuthenticationContext();
  const { currentGame, username } = useUserInformationContext();
  const { stompClient } = useStompClientContext();
  const [friends, setFriends] = useState<FriendInformation[]>([]);
  const [requests, setRequests] = useState<string[]>([]);

  const fetchFriendsData = async () => {
    if (!authToken) return;

    try {
      const { friends, requests } = (await FriendsService.list(authToken)) as UserFriendData;

      friends.sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.username.localeCompare(b.username);
      });

      setFriends(friends);
      setRequests(requests);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const doAccept = async (responseUser: string) => {
    if (!stompClient || !stompClient.connected) return;

    if (currentGame) {
      return toast.error('You are currently in a game! Please finish it first!');
    }

    stompClient?.send(
      topics.USER_FRIENDS(responseUser),
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteResponse,
        username,
      }),
    );

    triggerEvent(EventName.OpenMatchFoundModal, `${responseUser}-${username}`);
  };

  const onMessages = async (message: FriendsMessage) => {
    switch (message.type) {
      case FriendsMessageType.FriendRequest:
        return triggerEvent(EventName.ReloadFriends);
      case FriendsMessageType.FriendResponse:
        triggerEvent(EventName.ReloadFriends);
        triggerEvent(EventName.ReloadConversation);
        return toast(
          <Box className='flex items-center gap-4 text-black'>
            <Box>
              <GroupIcon />
            </Box>
            <Box>
              <strong>{message.username}</strong> accepted your friend request!
            </Box>
          </Box>,
        );
      case FriendsMessageType.InviteRequest:
        return toast(
          <Box className='flex items-center gap-4 text-black'>
            <Box>
              <LocalFireDepartmentIcon />
            </Box>
            <Box>
              <strong>{message.username}</strong> want to play with youu!!! <strong>Tap to accept!</strong>
            </Box>
          </Box>,
          {
            onClick: () => doAccept(message.username),
            hideProgressBar: false,
            autoClose: 5000,
          },
        );

      case FriendsMessageType.InviteResponse:
        triggerEvent(EventName.OpenMatchFoundModal, `${username}-${message.username}`);

        return (() => {
          toast(
            <Box className='flex items-center gap-4 text-black'>
              <Box>
                <LocalFireDepartmentIcon />
              </Box>
              <Box>
                <strong>{message.username}</strong> accepted your request!
              </Box>
            </Box>,
          );
        })();
    }
  };

  useEffect(() => {
    eventEmitter.on(EventName.OnTopicFriends, async (message: FriendsMessage) => await onMessages(message));
    eventEmitter.on(EventName.ReloadFriends, async () => await fetchFriendsData());

    return () => {
      eventEmitter.off(EventName.OnTopicFriends);
      eventEmitter.off(EventName.ReloadFriends);
    };
  }, [authToken, username]);

  useAsync(async () => {
    if (!authToken) {
      setFriends([]);
      setRequests([]);
    } else {
      await fetchFriendsData();
    }
  }, [authToken]);

  return <FriendsContext.Provider value={{ friends, requests }}>{children}</FriendsContext.Provider>;
}
