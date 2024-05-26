import { Box } from '@mui/material';
import GameCard from '@/pages/Dashboard/PlayBox/GameCard.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import InGameWindow from '@/pages/Game/InGameWindow';
import { useGameContext } from '@/providers/GameProvider.tsx';

export default function PlayBox() {
  const { nextMove } = useGameContext();
  const { currentGame } = useUserInformationContext();

  if (currentGame && nextMove) {
    return <InGameWindow />;
  }

  return (
    <>
      <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-custom bg-white'>
        <Box className='h-full flex flex-col gap-4 w-full p-4'>
          <GameCard />
        </Box>
      </Box>
    </>
  );
}
