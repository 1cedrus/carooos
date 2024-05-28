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
  roomCode: string;
  nextMove?: string;
  currentMoves: number[];
  firstUser: string;
  secondUser: string;
  inGameChat?: InGameChatMessage[];
  doMove: (move: number) => void;
  lastMoveTimeStamp: number;
}

export const GameContext = createContext<GameContext>({} as GameContext);

export const useGameContext = () => {
  return useContext(GameContext);
};

export default function GameProvider({ children }: Props) {
  const { currentGame: roomCode, username } = useUserInformationContext();
  const { stompClient } = useStompClientContext();
  const [nextMove, setNextMove] = useState<string>();
  const [currentMoves, setCurrentMoves] = useState<number[]>([]);
  const [firstUser, secondUser] = [username!, roomCode.split('-').find((user) => user !== username)!];
  const [inGameChat, setInGameChat] = useState<InGameChatMessage[]>([]);
  const [lastMoveTimeStamp, setLastMoveTimeStamp] = useState<number>(0);

  useEffect(() => {
    setCurrentMoves([]);
    setNextMove('');
    setInGameChat([]);
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode || !stompClient || !stompClient.connected || (username !== firstUser && username !== secondUser))
      return;

    const handleJoinMessage = (msg: JoinMessage) => {
      setNextMove(msg.nextMove);
      setCurrentMoves(msg.currentMoves);
      setLastMoveTimeStamp(msg.lastMoveTimeStamp ? Date.parse(msg.lastMoveTimeStamp) + 7 * 60 * 60 * 1000 : Date.now());
    };

    const handleMoveMessage = (msg: MoveMessage) => {
      setCurrentMoves((pre) => [...pre, msg.move]);
      setNextMove(msg.nextMove);
      setLastMoveTimeStamp(Date.parse(msg.lastMoveTimeStamp) + 7 * 60 * 60 * 1000);
    };

    const handleFinishMessage = (msg: FinishMessage) => {
      triggerEvent(EventName.OpenWinnerAnnouncementModal, msg.winner);
      triggerEvent(EventName.ReloadInfo);
    };

    const handleInGameMessage = (msg: InGameChatMessage) => {
      setInGameChat((pre) => [msg, ...pre]);
    };

    const sub = stompClient.subscribe(topics.GAME(roomCode), (message) => {
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
          return triggerEvent(EventName.OpenDrawAnnouncementModal, '/dashboard');
      }
    });

    stompClient.send(topics.JOIN_GAME(roomCode));

    return () => {
      sub.unsubscribe();
    };
  }, [stompClient, roomCode]);

  const doMove = (move: number) => {
    if (nextMove !== username || currentMoves.includes(move)) {
      return;
    }

    stompClient?.send(topics.PLAY_GAME(roomCode), {}, move.toString());
  };

  return (
    <GameContext.Provider
      value={{ roomCode, nextMove, currentMoves, firstUser, secondUser, doMove, inGameChat, lastMoveTimeStamp }}>
      {children}
    </GameContext.Provider>
  );
}
