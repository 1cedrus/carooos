import { useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Cross from '@/assets/cross.png';
import Nought from '@/assets/nought.png';
import { Props } from '@/types.ts';
import { getLast } from '@/utils/number.ts';

const crossImage = new Image();
crossImage.src = Cross;

const noughtImage = new Image();
noughtImage.src = Nought;

interface CaroTableProps extends Props {
  doMove: (move: number) => void;
  currentMoves: number[];
}

export default function CaroTable({ doMove, currentMoves }: CaroTableProps) {
  // const [waitMove, setWaitMove] = useState<number>();
  const largeScreen = useMediaQuery('(min-width:640px)');

  // Draw caro table
  useEffect(() => {
    const canvas = document.getElementById('layer-1') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, 1000, 1000);

    context.strokeStyle = '#000';
    context.lineWidth = 0.5;

    for (let x = 50; x < 1000; x += 50) {
      context.moveTo(x, 0);
      context.lineTo(x, 1000);
    }

    for (let y = 50; y < 1000; y += 50) {
      context.moveTo(0, y);
      context.lineTo(1000, y);
    }

    context.stroke();
  }, [currentMoves]);

  // Draw current moves
  useEffect(() => {
    if (!currentMoves.length) return;

    const canvas = document.getElementById('layer-1') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    currentMoves.forEach((move, idx) => {
      const x = Math.floor(move % 20);
      const y = Math.floor(move / 20);

      if (idx % 2 === 0) {
        context.drawImage(crossImage, x * 50 + 5, y * 50 + 5, 40, 40);
      } else {
        context.drawImage(noughtImage, x * 50 + 5, y * 50 + 5, 40, 40);
      }
    });
  }, [currentMoves]);

  // Highlight last move, on wait move and highlight current spot based on mouse
  const handleMouseMove = (event: any) => {
    const canvas = document.getElementById('layer-2') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    context.clearRect(0, 0, 1000, 1000);

    const pos = canvas.getBoundingClientRect();
    let x, y;
    if (largeScreen) {
      x = Math.floor((((event.clientX - pos.x) / 640) * 1000) / 50);
      y = Math.floor((((event.clientY - pos.y) / 640) * 1000) / 50);
    } else {
      x = Math.floor((((event.clientX - pos.x) / 400) * 1000) / 50);
      y = Math.floor((((event.clientY - pos.y) / 400) * 1000) / 50);
    }

    context.fillStyle = 'rgba(218,178,218,0.5)';
    context.fillRect(x * 50, y * 50, 50, 50);

    // Highlight last move
    if (!currentMoves) return;
    x = Math.floor(getLast(currentMoves) % 20);
    y = Math.floor(getLast(currentMoves) / 20);

    context.fillRect(x * 50, y * 50, 50, 50);

    // if (!waitMove) return;
    // x = Math.floor(waitMove % 20);
    // y = Math.floor(waitMove / 20);
    //
    // context.fillRect(x * 50, y * 50, 50, 50);
  };

  const handleMouseClick = (event: any) => {
    const canvas = document.getElementById('layer-1') as HTMLCanvasElement;

    const pos = canvas.getBoundingClientRect();
    let x, y;
    if (largeScreen) {
      x = Math.floor((((event.clientX - pos.x) / 640) * 1000) / 50);
      y = Math.floor((((event.clientY - pos.y) / 640) * 1000) / 50);
    } else {
      x = Math.floor((((event.clientX - pos.x) / 400) * 1000) / 50);
      y = Math.floor((((event.clientY - pos.y) / 400) * 1000) / 50);
    }

    const move = 20 * y + x;
    // if (move === waitMove) {
    doMove(move);
    //   setWaitMove(undefined);
    // } else {
    //   setWaitMove(move);
    // }
  };

  return (
    <Box className='relative w-[25rem] h-[25rem] md:h-[40rem] md:w-[40rem]'>
      <canvas
        id='layer-1'
        className='absolute top-0 left-0 w-[25rem] h-[25rem] md:w-[40rem] md:h-[40rem]'
        width='1000'
        height='1000'></canvas>
      <canvas
        id='layer-2'
        className='absolute top-0 left-0 w-[25rem] h-[25rem] md:w-[40rem] md:h-[40rem] z-40'
        width='1000'
        height='1000'
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseClick}></canvas>
    </Box>
  );
}
