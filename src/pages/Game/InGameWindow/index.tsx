import { Box, LinearProgress } from '@mui/material';
import StatusBar from '@/pages/Game/InGameWindow/StatusBar.tsx';
import CaroTable from '@/pages/Game/InGameWindow/CaroTable.tsx';
import MessageButton from '@/pages/Game/InGameWindow/MessageButton.tsx';
import WinnerAnnouncement from '@/pages/Game/InGameWindow/WinnerAnnouncement.tsx';
import { useEffect, useState } from 'react';
import { useGameContext } from '@/providers/GameProvider.tsx';

export default function InGameWindow() {
  const { nextMove } = useGameContext();
  const [time, setTime] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => setTime((pre) => pre - 100 / 12), 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setTime(100);
  }, [nextMove]);

  return (
    <>
      <Box className='h-full flex gap-4 flex-col items-center justify-center'>
        <StatusBar />
        <Box>
          <Box className='md:w-[40rem]'>
            <LinearProgress color='inherit' value={time} variant='determinate' />
          </Box>
          <Box className='flex-initial border-2 border-black rounded'>
            <CaroTable />
          </Box>
        </Box>
        <MessageButton />
      </Box>
      <WinnerAnnouncement />
    </>
  );
}
