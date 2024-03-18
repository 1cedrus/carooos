import { Box } from '@mui/material';
import User from '@/components/shared/User.tsx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGameContext } from '@/providers/GameProvider.tsx';

export default function StatusBar() {
  const { nextMove, firstUser, secondUser, inGameChat } = useGameContext();

  return (
    <Box className=''>
      <Box className='flex justify-between items-center gap-4 md:gap-14'>
        <Box className='relative'>
          <User username={firstUser} />
          {inGameChat?.firstUserMsg && (
            <Box
              component='p'
              className='break-word max-w-[7rem] text-center absolute right-0 bg-white border-2 border-black p-2 px-4 z-10'>
              {inGameChat.firstUserMsg}
            </Box>
          )}
        </Box>
        {<ArrowBackIosNewIcon className={`${firstUser !== nextMove ? 'invisible' : ''}`} />}
        <LocalFireDepartmentIcon />
        {<ArrowForwardIosIcon className={secondUser !== nextMove ? 'invisible' : ''} />}
        <Box className='relative'>
          <User username={secondUser} />
          {inGameChat?.secondUserMsg && (
            <Box
              component='p'
              className='break-word max-w-[7rem] text-center absolute left-[-5rem] bg-white border-2 border-black p-2 px-4 z-10'>
              {inGameChat.secondUserMsg}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
