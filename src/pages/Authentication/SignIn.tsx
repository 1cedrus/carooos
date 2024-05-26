import { Box, Grow, Link, TextField } from '@mui/material';
import Button from '@/components/custom/Button.tsx';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';

export default function SignIn() {
  const { pathname } = useLocation();
  const { doSignIn } = useAuthenticationContext();
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await doSignIn({ usernameOrEmail, password });
  };

  const isAvailable = pathname === '/login';

  return (
    <>
      <Grow in={isAvailable}>
        <Box
          sx={{ display: isAvailable ? 'flex' : 'none' }}
          className='flex flex-col h-screen justify-center items-center'>
          <Box
            component='h1'
            className='text-white font-bold'
            sx={{
              textShadow:
                '5px 5px black, -5px -5px black, -5px -5px black, 5px 5px black, -5px 5px black, 5px -5px black',
              fontSize: '2rem',
            }}>
            CAROOOS!
          </Box>
          <Box className='w-[25rem] border-2 border-black rounded p-4 shadow-custom bg-white'>
            <Box component='form' onSubmit={handleSubmit} className='flex flex-col gap-2 text-center '>
              <TextField
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder='user or email'
              />
              <TextField
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='passw'
              />
              <Button type='submit' disabled={!usernameOrEmail || !password}>
                Sign In
              </Button>
              <Box className='flex justify-between'>
                <Link
                  onClick={() => navigate('/reset-password')}
                  sx={{ color: 'black', fontSize: '0.8rem' }}
                  className='cursor-pointer '>
                  Forgot your password?
                </Link>
                <Link
                  onClick={() => navigate('/register')}
                  sx={{ color: 'black', fontSize: '0.8rem' }}
                  className='cursor-pointer'>
                  Sign up an account
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grow>
    </>
  );
}
