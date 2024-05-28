import { useQueueContext } from '@/providers/QueueProvider.tsx';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

export default function TimeCounter() {
  const { onQueue } = useQueueContext();
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!onQueue) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      setTime(0);
    };
  }, [onQueue]);

  if (!onQueue) {
    return null;
  }

  return (
    <Box className='border-2 border-black bg-white shadow-custom rounded-2xl w-full text-center p-2 self-start font-bold'>{`${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`}</Box>
  );
}
