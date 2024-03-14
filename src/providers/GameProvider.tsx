import { createContext, useContext, useEffect, useState } from 'react';
import {
  FinishMessage,
  GameMessage,
  GameMessageType,
  JoinMessage,
  MessagesMessage,
  MoveMessage,
  Props,
} from '@/types.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';

export interface GameContext {
  id: string;
  nextMove?: string;
  currentMoves?: number[];
  firstUser: string;
  secondUser: string;
  winner?: string;
  message?: MessagesMessage;
  doMove: (move: number) => void;
  isDraw?: boolean;
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
  const [message, setMessage] = useState<MessagesMessage>();
  const [firstUser, secondUser] = id.split('-');
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    if (!stompClient || (username !== firstUser && username !== secondUser)) return;
    const sub = stompClient!.subscribe(`/topic/game/${id}`, (message) => {
      const content = JSON.parse(message.body) as GameMessage;

      switch (content.type) {
        case GameMessageType.Join:
          {
            const { currentMoves, nextMove } = content as JoinMessage;
            setNextMove(nextMove);
            setCurrentMoves(currentMoves);
          }
          break;
        case GameMessageType.Move:
          const { move, nextMove } = content as MoveMessage;
          setCurrentMoves((pre) => [...pre, move]);
          setNextMove(nextMove);
          break;
        case GameMessageType.Finish:
          const { winner } = content as FinishMessage;
          setWinner(winner);
          break;
        case GameMessageType.Messages:
          setMessage(content as MessagesMessage);
          break;
        case GameMessageType.Draw:
          setIsDraw(true);
          break;
      }
    });

    stompClient!.send(`/app/join/${id}`, {}, '');

    return () => {
      sub.unsubscribe();
    };
  }, [stompClient]);

  useEffect(() => {
    const clearMessage = setTimeout(() => setMessage({} as MessagesMessage), 5000);

    return () => {
      clearTimeout(clearMessage);
    };
  }, [message]);

  const doMove = (move: number) => {
    if (nextMove !== username || currentMoves.includes(move)) {
      return;
    }

    stompClient?.send(`/app/game/${id}`, {}, move.toString());
  };

  return (
    <GameContext.Provider
      value={{ id, nextMove, currentMoves, winner, firstUser, secondUser, doMove, message, isDraw }}>
      {children}
    </GameContext.Provider>
  );
}
