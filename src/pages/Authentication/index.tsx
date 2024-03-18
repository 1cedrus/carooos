import SignIn from '@/pages/Authentication/SignIn.tsx';
import SignUp from '@/pages/Authentication/SignUp.tsx';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';

export default function Authentication() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <Box className='px-4'>
      <SignUp />
      <SignIn />
    </Box>
  );
}
