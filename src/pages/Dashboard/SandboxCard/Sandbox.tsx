import SandboxProvider, { useSandboxContext } from '@/providers/SandboxProvider.tsx';
import CaroTable from '@/components/shared/CaroTable.tsx';
import { Box, IconButton } from '@mui/material';
import WinnerAnnouncement from '@/components/shared/WinnerAnnouncement.tsx';
import DrawAnnouncement from '@/components/shared/DrawAnnouncement.tsx';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function Sandbox() {
  return (
    <SandboxProvider>
      <SandBoxContainer />
    </SandboxProvider>
  );
}

function SandBoxContainer() {
  const { doMove, currentMoves, doReturn, doForward, canForward, canReturn } = useSandboxContext();

  return (
    <Box className='h-screen flex gap-4  items-center justify-center'>
      <Box className='flex flex-col'>
        <IconButton onClick={doReturn} sx={{ color: 'black' }} disabled={!canReturn}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={doForward} sx={{ color: 'black' }} disabled={!canForward}>
          <ArrowDownwardIcon />
        </IconButton>
      </Box>
      <Box className='border-2 border-black'>
        <CaroTable doMove={doMove} currentMoves={currentMoves} />
      </Box>
      <WinnerAnnouncement />
      <DrawAnnouncement />
    </Box>
  );
}
