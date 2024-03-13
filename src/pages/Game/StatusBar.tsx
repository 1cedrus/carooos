import { Box, Tooltip } from '@mui/material';
import User from '@/components/shared/User.tsx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGameContext } from '@/providers/GameProvider.tsx';

export default function StatusBar() {
  const { nextMove, firstUser, secondUser, message } = useGameContext();

  console.log(message, firstUser, secondUser);

  return (
    <Box className=''>
      <Box className='flex justify-between items-center gap-4 md:gap-14'>
        <Box className='relative'>
          <User username={firstUser} />
          {message?.sender === firstUser && (
            <Box className='absolute right-0 bg-white border-2 border-black p-2 px-4 z-10'>{message.content}</Box>
          )}
        </Box>
        {<ArrowBackIosNewIcon className={`${firstUser !== nextMove ? 'invisible' : ''}`} />}
        <LocalFireDepartmentIcon />
        {<ArrowForwardIosIcon className={secondUser !== nextMove ? 'invisible' : ''} />}
        <Box className='relative'>
          <User username={secondUser} />
          {message?.sender === secondUser && (
            <Box className='absolute left-[-5rem] bg-white border-2 border-black p-2 px-4 z-10'>{message.content}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
