import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';
import { isGameDraw, isGameFinish } from '@/utils/game.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { getLast } from '@/utils/number.ts';

const DEFAULT_SANDBOX_ROOM_CODE = 'X-O';

interface SandboxContext {
  roomCode: string;
  nextMove?: string;
  currentMoves: number[];
  doMove: (move: number) => void;
  firstUser: string;
  secondUser: string;
  doReturn: () => void;
  doForward: () => void;
  canForward?: boolean;
  canReturn?: boolean;
}

export const SandboxContext = createContext<SandboxContext>({} as SandboxContext);

export const useSandboxContext = () => {
  return useContext(SandboxContext);
};

interface SandboxProviderProps extends Props {
  roomCode?: string;
}

export default function SandboxProvider({ children, roomCode = DEFAULT_SANDBOX_ROOM_CODE }: SandboxProviderProps) {
  const [nextMove, setNextMove] = useState<string>();
  const [currentMoves, setCurrentMoves] = useState<number[]>([]);
  const [pastMoves, setPastMoves] = useState<number[]>([]);
  const [firstUser, secondUser] = roomCode.split('-');

  const doReturn = () => {
    if (!currentMoves.length) return;
    const returnMove = getLast(currentMoves);
    setPastMoves((pre) => [...pre, returnMove!]);
    setCurrentMoves((pre) => [...pre.slice(0, -1)]);
  };

  const doForward = () => {
    if (!pastMoves.length) return;
    const forwardMove = pastMoves.pop();
    setCurrentMoves((pre) => [...pre, forwardMove!]);
  };

  const doMove = (move: number) => {
    if (currentMoves.includes(move)) return;

    setCurrentMoves((pre) => [...pre, move]);
    setNextMove((pre) => (pre === firstUser ? secondUser : firstUser));
    setPastMoves([]);
  };

  useEffect(() => {
    if (currentMoves.length === 0) return;

    if (isGameFinish(currentMoves)) {
      const winner = (currentMoves.length - 1) % 2 === 0 ? firstUser : secondUser;
      triggerEvent(EventName.OpenWinnerAnnouncementModal, winner);
      setCurrentMoves([]);
    } else if (isGameDraw(currentMoves)) {
      triggerEvent(EventName.OpenDrawAnnouncementModal);
      setCurrentMoves([]);
    }
  }, [currentMoves]);

  useEffect(() => {
    if (roomCode !== DEFAULT_SANDBOX_ROOM_CODE) return;
    setNextMove(firstUser);
  }, []);

  const canForward = pastMoves.length > 0;
  const canReturn = currentMoves.length > 0;

  return (
    <SandboxContext.Provider
      value={{
        roomCode,
        nextMove,
        currentMoves,
        firstUser,
        secondUser,
        doMove,
        doForward,
        doReturn,
        canForward,
        canReturn,
      }}>
      {children}
    </SandboxContext.Provider>
  );
}
