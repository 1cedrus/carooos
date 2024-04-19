import { Box } from '@mui/material';
import StatusBar from '@/pages/Game/InGameWindow/StatusBar.tsx';
import CaroTable from '@/components/shared/CaroTable.tsx';
import { useGameContext } from '@/providers/GameProvider.tsx';

export default function InGameWindow() {
  const { currentMoves, doMove } = useGameContext();

  return (
    <>
      <Box className='flex gap-2'>
        <Box className='border-2 border-black rounded-2xl overflow-hidden'>
          <CaroTable currentMoves={currentMoves} doMove={doMove} />
        </Box>
        <Box>
          <StatusBar />
        </Box>
      </Box>
    </>
  );
}
