import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import GameCard from '@/pages/Dashboard/GameCard.tsx';
import SandboxCard from '@/pages/Dashboard/SandboxCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationContext();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  return (
    <Box className='flex flex-col lg:flex-row h-screen py-4 gap-4 mx-4 justify-center items-center'>
      <Outlet />
      <Box className='flex lg:flex-col gap-4 h-[10rem] lg:h-[30rem] w-full lg:w-fit'>
        <GameCard />
        <SandboxCard />
      </Box>
    </Box>
  );
}
