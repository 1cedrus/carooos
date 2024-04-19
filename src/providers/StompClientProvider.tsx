import { createContext, useContext, useEffect, useState } from 'react';
import {
  FindingMessage,
  FriendsMessage,
  FriendsMessageType,
  MatchingMessage,
  OkMessage,
  Props,
  QueueMessage,
  QueueMessageType,
} from '@/types.ts';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { api } from '@/utils/api.ts';
import { topics } from '@/utils/topics.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export interface StompClientContext {
  stompClient?: CompatClient;
  doQueue: () => void;
  quitQueue: () => void;
  doJoinGame: (roomCode: string) => void;
  quitGame: () => void;
  onQueue: boolean;
}

export const StompClientContext = createContext<StompClientContext>({} as StompClientContext);

export const useStompClientContext = () => {
  return useContext(StompClientContext);
};

export default function StompClientProvider({ children }: Props) {
  const { isAuthenticated, authToken } = useAuthenticationContext();
  const { username, elo, setCurrentGame, currentGame } = useUserInformationContext();
  const [stompClient, setStompClient] = useState<CompatClient>();
  const [queueBroker, setQueueBroker] = useState<string>();
  const [gameBroker, setGameBroker] = useState<string>();
  const [onWaitingConfirmation, setOnWaitingConfirmation] = useState(false);
  const [onQueue, setOnQueue] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const stompClient = Stomp.client(api.ws);
    stompClient.connect(
      {
        Authorization: `Bearer ${authToken}`,
      },
      () => console.log('WebSocket established!'),
    );

    // Intend to make component re-render in-time
    setTimeout(() => setStompClient(stompClient), 1000);

    return () => {
      stompClient?.disconnect();
    };
  }, [isAuthenticated]);

  const doAccept = async (responseUser: string) => {
    if (currentGame) {
      return toast.error('You are currently in a game! Please finish it first!');
    }

    stompClient?.send(
      topics.USER_FRIENDS(responseUser),
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteResponse,
        username: username,
      }),
    );
    triggerEvent(EventName.NavigateTo, '/play');
    setCurrentGame(`${responseUser}-${username}`);
  };

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const mesSub = stompClient.subscribe(topics.MESSAGES, (message) => {
      triggerEvent(EventName.OnTopicMessages, JSON.parse(message.body));
      setTimeout(() => triggerEvent(EventName.ReloadInfo), 1000);
    });
    console.log('Subscribed to /user/topic/messages');

    const friendsSub = stompClient.subscribe(topics.FRIENDS, (imessage) => {
      const message = JSON.parse(imessage.body) as FriendsMessage;

      switch (message.type) {
        case FriendsMessageType.FriendRequest:
          return triggerEvent(EventName.ReloadInfo);
        case FriendsMessageType.FriendResponse:
          return (() => {
            triggerEvent(EventName.ReloadInfo);
            toast(
              <Box className='flex items-center gap-4 text-black'>
                <Box>
                  <GroupIcon />
                </Box>
                <Box>
                  <strong>{message.username}</strong> accepted your friend request!
                </Box>
              </Box>,
            );
          })();
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
          setCurrentGame(`${username}-${message.username}`);
          triggerEvent(EventName.NavigateTo, '/play');

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
    });
    console.log('Subscribed to /user/topic/friends');

    return () => {
      mesSub.unsubscribe();
      friendsSub.unsubscribe();
    };
  }, [stompClient]);

  const doQueue = () => {
    if (!stompClient || !stompClient.connected) return;

    const sub = stompClient?.subscribe(topics.QUEUE, (response) => {
      const message = JSON.parse(response.body) as QueueMessage;

      switch (message.type) {
        case QueueMessageType.FINDING:
          const { username: findingUsername, elo: findingElo } = message.data as FindingMessage;

          if (onWaitingConfirmation || username === findingUsername || Math.abs(elo! - findingElo) > 100) return;

          stompClient?.send(
            '/topic/queue',
            {},
            JSON.stringify({
              type: QueueMessageType.MATCHING,
              data: {
                match: `${username}-${findingUsername}`,
              },
            }),
          );

          setOnWaitingConfirmation(true);
          setTimeout(() => setOnWaitingConfirmation(false), 5000);
          break;
        case QueueMessageType.MATCHING:
          const { match } = message.data as MatchingMessage;
          const [userSend, intendToReceived] = match.split('-');

          if (onWaitingConfirmation || username === userSend || username !== intendToReceived) return;

          stompClient?.send(
            '/topic/queue',
            {},
            JSON.stringify({
              type: QueueMessageType.OK,
              data: {
                ok: match,
              },
            }),
          );

          quitQueue();
          triggerEvent(EventName.OpenMatchFoundModal, `${userSend}-${intendToReceived}`);
          break;

        case QueueMessageType.OK:
          const { ok } = message.data as OkMessage;
          const [user1, user2] = ok.split('-');

          if (!onWaitingConfirmation && username !== user1) return;

          quitQueue();
          triggerEvent(EventName.OpenMatchFoundModal, `${user1}-${user2}`);
          break;
      }
    });

    stompClient?.send(
      '/topic/queue',
      {},
      JSON.stringify({
        type: QueueMessageType.FINDING,
        data: {
          username,
          elo,
        },
      }),
    );

    setQueueBroker(sub?.id);
    setOnQueue(true);
  };

  const quitQueue = () => {
    if (!stompClient || !stompClient.connected || !queueBroker) return;

    stompClient.unsubscribe(queueBroker);
    setOnQueue(false);
  };

  const doJoinGame = (roomCode: string) => {
    if (!stompClient || !stompClient.connected) return;

    const sub = stompClient.subscribe(topics.GAME(roomCode), (message) => {
      triggerEvent(EventName.OnTopicGame, JSON.parse(message.body));
    });

    setGameBroker(sub.id);
  };

  const quitGame = () => {
    if (!stompClient || !stompClient.connected || !gameBroker) return;

    stompClient.unsubscribe(gameBroker);
  };

  return (
    <StompClientContext.Provider value={{ stompClient, doQueue, quitQueue, doJoinGame, quitGame, onQueue }}>
      {children}
    </StompClientContext.Provider>
  );
}
