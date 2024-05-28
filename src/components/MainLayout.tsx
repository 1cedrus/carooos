import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

export default function MainLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goBack = () => {
    navigate('/dashboard');
  };

  const isDashboard = pathname === '/dashboard';
  const isIngame = pathname.startsWith('/game');

  return (
    <Box className='flex flex-col h-screen'>
      <Box className='flex justify-between p-4'>
        <Box
          visibility={isIngame ? 'hidden' : 'visible'}
          onClick={goBack}
          component='button'
          className='p-4 py-0 bg-white  border-black  text-xl hover:text-2xl transition-all cursor-pointer'>
          <Box
            component='h1'
            className='text-white font-extrabold italic'
            sx={{
              textShadow:
                '2px 2px black, -2px -2px black, -2px -5px black, 5px 5px black, -5px 5px black, 5px -5px black',
            }}>
            {isDashboard ? 'CAROOOS!' : 'Back'}
          </Box>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
}
