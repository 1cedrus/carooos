import { createContext, useContext, useEffect, useState } from 'react';
import {
  FinishMessage,
  GameMessage,
  GameMessageType,
  InGameChatMessage,
  JoinMessage,
  MoveMessage,
  Props,
} from '@/types.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { topics } from '@/utils/topics.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';

export interface GameContext {
  id: string;
  nextMove?: string;
  currentMoves?: number[];
  firstUser: string;
  secondUser: string;
  winner?: string;
  inGameChat?: InGameChat;
  doMove: (move: number) => void;
  isDraw?: boolean;
}

export interface InGameChat {
  firstUserMsg: string;
  secondUserMsg: string;
}

export const GameContext = createContext<GameContext>({} as GameContext);

export const useGameContext = () => {
  return useContext(GameContext);
};

interface GameProviderProps extends Props {
  id: string;
}

export default function GameProvider({ id, children }: GameProviderProps) {
  const { username } = useUserInformationContext();
  const { stompClient } = useStompClientContext();
  const [nextMove, setNextMove] = useState<string>();
  const [currentMoves, setCurrentMoves] = useState<number[]>([]);
  const [winner, setWinner] = useState<string>();
  const [isDraw, setIsDraw] = useState(false);
  const [firstUserMsg, setFirstUserMsg] = useState<string>();
  const [secondUserMsg, setSecondUserMsg] = useState<string>();
  const [firstUser, secondUser] = id.split('-');

  useEffect(() => {
    if (!stompClient || !stompClient.connected || (username !== firstUser && username !== secondUser)) return;

    const handleJoinMessage = (msg: JoinMessage) => {
      setNextMove(msg.nextMove);
      setCurrentMoves(msg.currentMoves);
    };

    const handleMoveMessage = (msg: MoveMessage) => {
      setCurrentMoves((pre) => [...pre, msg.move]);
      setNextMove(msg.nextMove);
    };

    const handleFinishMessage = (msg: FinishMessage) => {
      setWinner(msg.winner);
      triggerEvent(EventName.ReloadInfo);
    };

    const handleInGameMessage = (msg: InGameChatMessage) => {
      const { sender, content } = msg;

      if (sender === firstUser) {
        setFirstUserMsg(content);
      } else if (sender === secondUser) {
        setSecondUserMsg(content);
      }
    };

    const sub = stompClient.subscribe(topics.GAME(id), (message) => {
      const content = JSON.parse(message.body) as GameMessage;

      switch (content.type) {
        case GameMessageType.Join:
          return handleJoinMessage(content as JoinMessage);
        case GameMessageType.Move:
          return handleMoveMessage(content as MoveMessage);
        case GameMessageType.Finish:
          return handleFinishMessage(content as FinishMessage);
        case GameMessageType.InGameChat:
          return handleInGameMessage(content as InGameChatMessage);
        case GameMessageType.Draw:
          return setIsDraw(true);
      }
    });

    stompClient.send(topics.JOIN_GAME(id));

    return () => {
      sub.unsubscribe();
    };
  }, [stompClient]);

  const doMove = (move: number) => {
    if (nextMove !== username || currentMoves.includes(move)) {
      return;
    }

    stompClient?.send(topics.PLAY_GAME(id), {}, move.toString());
  };

  useEffect(() => {
    const clearMessage = setTimeout(() => setFirstUserMsg(''), 5000);

    return () => {
      clearTimeout(clearMessage);
    };
  }, [firstUserMsg]);

  useEffect(() => {
    const clearMessage = setTimeout(() => setSecondUserMsg(''), 5000);

    return () => {
      clearTimeout(clearMessage);
    };
  }, [secondUserMsg]);

  const inGameChat = {
    firstUserMsg,
    secondUserMsg,
  } as InGameChat;

  return (
    <GameContext.Provider
      value={{ id, nextMove, currentMoves, winner, firstUser, secondUser, doMove, inGameChat, isDraw }}>
      {children}
    </GameContext.Provider>
  );
}
