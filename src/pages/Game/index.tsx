import { useParams } from 'react-router-dom';
import GameProvider from '@/providers/GameProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import InGameWindow from '@/pages/Game/InGameWindow';

export default function Game() {
  const { roomCode } = useParams();
  const { username } = useUserInformationContext();

  if (!roomCode || !username || (username && !roomCode.split('-').includes(username))) return <ErrorPage />;

  return (
    <GameProvider roomCode={roomCode}>
      <GameContainer />
    </GameProvider>
  );
}

function GameContainer() {
  // const { nextMove, roomCode } = useGameContext();

  // if (!nextMove) return <MatchFound />;

  return <InGameWindow />;
}
