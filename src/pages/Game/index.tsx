import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import GameProvider, { useGameContext } from '@/providers/GameProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import InGameWindow from '@/pages/Game/InGameWindow';
import MatchFound from '@/pages/Game/MatchFound.tsx';

export default function Game() {
  const { id } = useParams();
  const { username } = useUserInformationContext();

  if (!id || !username || (username && !id.split('-').includes(username))) return <ErrorPage />;

  return (
    <GameProvider id={id}>
      <GameContainer />
    </GameProvider>
  );
}

function GameContainer() {
  const { nextMove } = useGameContext();

  if (!nextMove) return <MatchFound />;

  return (
    <Box className='h-screen'>
      <InGameWindow />
    </Box>
  );
}
