import { useGameContext } from '@/providers/GameProvider.tsx';
import { Box, Grow, LinearProgress } from '@mui/material';
import User from '@/components/shared/User.tsx';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MatchFound() {
  const navigate = useNavigate();
  const { firstUser, secondUser } = useGameContext();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 200) {
      toast.error('There are some errors occurred!');
      navigate('/dashboard');
    }
  }, [progress]);

  useEffect(() => {
    const timer = setInterval(() => setProgress((pre) => pre + 20), 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grow in={true}>
      <Box className='h-screen flex flex-col justify-center items-center gap-4 px-4'>
        <Box className='flex flex-col items-center gap-10 p-4 border-2 border-black rounded'>
          <Box component='h1' className='text-2xl'>
            MATCH FOUND!
          </Box>
          <Box className='flex gap-10 items-center'>
            <User username={firstUser} />
            <LocalFireDepartmentIcon />
            <User username={secondUser} className='flex-row-reverse' />
          </Box>
        </Box>
        <Box className='mx-4 w-full lg:w-[27rem]'>
          <LinearProgress value={progress} variant='determinate' color='inherit' />
        </Box>
      </Box>
    </Grow>
  );
}
