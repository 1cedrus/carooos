import { FindingMessage, MatchingMessage, OkMessage, Props, QueueMessage, QueueMessageType } from '@/types.ts';
import { createContext, useContext, useState } from 'react';
import { topics } from '@/utils/topics.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

interface QueueContext {
  doQueue: () => void;
  quitQueue: () => void;
  doJoinGame: (roomCode: string) => void;
  onQueue: boolean;
  resetProgress: () => void;
}

export const QueueContext = createContext<QueueContext>({} as QueueContext);

export const useQueueContext = () => {
  return useContext(QueueContext);
};

export default function QueueProvider({ children }: Props) {
  const { stompClient } = useStompClientContext();
  const { username, elo, setCurrentGame, currentGame } = useUserInformationContext();
  const [queueBroker, setQueueBroker] = useState<string>();
  const [onWaitingConfirmation, setOnWaitingConfirmation] = useState(false);
  const [onQueue, setOnQueue] = useState(false);

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

          if (onWaitingConfirmation || username === userSend || currentGame || username !== intendToReceived) return;

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

          triggerEvent(EventName.OpenMatchFoundModal, `${userSend}-${intendToReceived}`);
          break;

        case QueueMessageType.OK:
          const { ok } = message.data as OkMessage;
          const [user1, user2] = ok.split('-');

          if (!onWaitingConfirmation && username !== user1) return;

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
    if (!stompClient || !stompClient.connected || currentGame) return;

    setCurrentGame(roomCode);
  };

  const resetProgress = () => {
    setCurrentGame('');
  };

  return (
    <QueueContext.Provider value={{ doQueue, doJoinGame, onQueue, quitQueue, resetProgress }}>
      {children}
    </QueueContext.Provider>
  );
}
