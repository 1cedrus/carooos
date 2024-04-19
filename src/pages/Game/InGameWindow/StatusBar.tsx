import { Box, Divider } from '@mui/material';
import User from '@/components/shared/User.tsx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGameContext } from '@/providers/GameProvider.tsx';
import MessageButton from '@/pages/Game/InGameWindow/MessageButton.tsx';

export default function StatusBar() {
  const { nextMove, firstUser, secondUser, inGameChat } = useGameContext();

  return (
    <Box className='p-2 border-2 border-black rounded-2xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
      <Box className='flex items-center gap-12'>
        <User username={firstUser} />
        {firstUser === nextMove ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
        <User username={secondUser} />
      </Box>
      <Divider />
      <Box>
        <Box className='my-2 h-[15rem] rounded border-[1px] border-black overflow-auto'>
          {inGameChat?.map((message, index) => (
            <Box key={index} className='p-2'>
              <Box className='font-bold'>{message.sender}</Box>
              <Box className='break-words'>{message.content}</Box>
            </Box>
          ))}
        </Box>
        <MessageButton />
      </Box>
    </Box>
  );
}
