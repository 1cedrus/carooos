import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { Outlet, useNavigate } from 'react-router-dom';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import NavigationBar from '@/pages/Dashboard/NavigationBar.tsx';
import WinnerAnnouncement from '@/components/shared/WinnerAnnouncement.tsx';
import DrawAnnouncement from '@/components/shared/DrawAnnouncement.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import MatchFound from '@/components/MatchFound.tsx';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isConnected } = useStompClientContext();
  const { isAuthenticated } = useAuthenticationContext();

  useEffect(() => {
    eventEmitter.on(EventName.NavigateTo, (path: string) => navigate(path));

    return () => {
      eventEmitter.off(EventName.NavigateTo, (path: string) => navigate(path));
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={!isConnected!}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box className='flex h-screen gap-4 justify-center items-center '>
        <Box className='flex gap-2'>
          <NavigationBar />
          <Outlet />
        </Box>
      </Box>
      <MatchFound />
      <WinnerAnnouncement />
      <DrawAnnouncement />
    </>
  );
}
