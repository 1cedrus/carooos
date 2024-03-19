import { getLast } from '@/utils/number.ts';

const BOUND_LENGTH_TO_WIN = 5;

export const isGameDraw = (currentMoves: number[]) => {
  return currentMoves.length === 400;
};

export const isGameFinish = (currentMoves: number[]) => {
  const userIndex = (currentMoves.length - 1) % 2;
  const movesOfUser = currentMoves.filter((move) => currentMoves.indexOf(move) % 2 === userIndex);

  return (
    // Vertical
    calculate(movesOfUser, 20) ||
    // Horizontal
    calculate(movesOfUser, 1) ||
    // Top left to bottom right
    calculate(movesOfUser, 21) ||
    // Top right to bottom left
    calculate(movesOfUser, 19)
  );
};

const calculate = (movesOfUser: number[], operand: number) => {
  const lastMove = getLast(movesOfUser);

  let length = 1;
  let isBound = false;
  let tmp = lastMove;
  while (length < 5) {
    if (movesOfUser.includes(tmp + operand)) {
      length += 1;
      tmp += operand;
    } else if (!isBound) {
      operand = -operand;
      tmp = lastMove;
      isBound = true;
    } else {
      break;
    }
  }

  return length >= BOUND_LENGTH_TO_WIN;
};
