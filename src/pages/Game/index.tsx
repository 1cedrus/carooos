import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import CaroTable from '@/pages/Game/CaroTable.tsx';
import GameProvider from '@/providers/GameProvider.tsx';
import StatusBar from '@/pages/Game/StatusBar.tsx';
import WinnerAnnouncement from '@/pages/Game/WinnerAnnouncement.tsx';
import MessageButton from '@/pages/Game/MessageButton.tsx';

export default function Game() {
  const { id } = useParams();

  if (!id) return <></>;
  return (
    <GameProvider id={id}>
      <Box className='h-screen'>
        <Box className='h-full flex gap-4 flex-col items-center justify-center'>
          <StatusBar />
          <Box className='flex-initial border-2 border-black rounded'>
            <CaroTable />
          </Box>
          <MessageButton />
        </Box>
      </Box>
      <WinnerAnnouncement />
    </GameProvider>
  );
}
