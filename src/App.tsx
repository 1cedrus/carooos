import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import XImage from '@/assets/x.png';
import OImage from '@/assets/o.png';

const X_IMAGE = new Image();
X_IMAGE.src = XImage;

const O_IMAGE = new Image();
O_IMAGE.src = OImage;

const WIN_POINT = 5;

enum Turn {
  X = 88,
  O = 79,
}

interface Move {
  x: number;
  y: number;
}

export default function App() {
  const [state, setState] = useState<Array<number>>(new Array(20 * 20));
  const [turn, setTurn] = useState<Turn>(Turn.X);
  const [lastMove, setLastMove] = useState<Move | undefined>();

  useEffect(() => {
    if (!lastMove) return;

    const lastTurn = turn === Turn.X ? Turn.O : Turn.X;
    const { x, y } = lastMove;
    let isWin = 1;

    for (let i = x + 1; i <= x + 5 && i < 20; i += 1) {
      if (state[y * 20 + i] === lastTurn) {
        isWin += 1;
      } else break;
    }

    for (let i = x - 1; i >= x - 5 && i >= 0; i -= 1) {
      if (state[y * 20 + i] === lastTurn) {
        isWin += 1;
      } else break;
    }

    if (isWin >= WIN_POINT) alert(`${turn} Win!`);
    isWin = 1;

    for (let i = y + 1; i <= y + 5 && i < 20; i += 1) {
      if (state[i * 20 + x] === lastTurn) {
        isWin += 1;
      } else break;
    }

    for (let i = y - 1; i >= y - 5 && i >= 0; i -= 1) {
      if (state[i * 20 + x] === lastTurn) {
        isWin += 1;
      } else break;
    }

    if (isWin >= WIN_POINT) alert(`${turn} Win!`);
    isWin = 1;

    for (let i = x + 1, j = y + 1; i <= x + 5 && i < 20 && j < 20; i += 1, j += 1) {
      if (state[j * 20 + i] === lastTurn) {
        isWin += 1;
      } else break;
    }

    for (let i = x - 1, j = y - 1; i <= x - 5 && i >= 0 && j >= 0; i -= 1, j -= 1) {
      if (state[j * 20 + i] === lastTurn) {
        isWin += 1;
      } else break;
    }

    if (isWin >= WIN_POINT) alert(`${turn} Win!`);
    isWin = 1;

    for (let i = x + 1, j = y - 1; i <= x + 5 && i < 20 && j >= 0; i += 1, j -= 1) {
      if (state[j * 20 + i] === lastTurn) {
        isWin += 1;
      } else break;
    }

    for (let i = x - 1, j = y + 1; i <= x - 5 && i >= 0 && j < 20; i -= 1, j += 1) {
      if (state[j * 20 + i] === lastTurn) {
        isWin += 1;
      } else break;
    }

    if (isWin >= WIN_POINT) alert(`${turn} Win!`);
  }, [lastMove]);

  useEffect(() => {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.log('Error occupied!');
      return;
    }

    context.lineWidth = 0.3;

    for (let x = 50; x < 1000; x += 50) {
      context.moveTo(x, 0);
      context.lineTo(x, 1000);
    }

    for (let y = 50; y < 1000; y += 50) {
      context.moveTo(0, y);
      context.lineTo(1000, y);
    }

    context.stroke();
  }, []);

  const handleMouseMove = (event: any) => {
    const canvas = document.getElementById('test') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.log('Error occupied!');
      return;
    }

    context.clearRect(0, 0, 1000, 1000);

    const x = Math.floor(event.clientX / 50);
    const y = Math.floor(event.clientY / 50);

    context.fillStyle = 'rgba(255, 0, 255, 0.5)';
    context.fillRect(x * 50, y * 50, 50, 50);
  };

  const handleMouseClick = (event: any) => {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.log('Error occupied!');
      return;
    }

    const x = Math.floor(event.clientX / 50);
    const y = Math.floor(event.clientY / 50);

    if (state[y * 20 + x]) return;

    if (turn === Turn.X) context.drawImage(X_IMAGE, x * 50 + 5, y * 50 + 5, 40, 40);
    else context.drawImage(O_IMAGE, x * 50 + 5, y * 50 + 5, 40, 40);

    setState((pre) => {
      const state = [...pre];
      state[y * 20 + x] = turn;
      return state;
    });
    setTurn((pre) => (pre === Turn.X ? Turn.O : Turn.X));
    setLastMove({ x, y });
  };

  return (
    <Box className='w-screen p-4 relative'>
      <canvas id='game' className='border-2 absolute top-0 left-0' width='1000' height='1000'></canvas>
      <canvas
        id='test'
        className='border-2 absolute top-0 left-0 z-0'
        width='1000'
        height='1000'
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseClick}></canvas>
    </Box>
  );
}
