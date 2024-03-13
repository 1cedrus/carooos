import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import UserInforCard from '@/pages/Dashboard/UserInforCard';
import GameCard from '@/pages/Dashboard/GameCard.tsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationContext();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  return (
    <Box className='flex flex-col lg:flex-row h-screen py-4 gap-4 lg:gap-5 mx-4 justify-center items-center'>
      <UserInforCard />
      <GameCard />
    </Box>
  );
}
