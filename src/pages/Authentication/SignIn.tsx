import { Box, Grow, Link, TextField } from '@mui/material';
import Button from '@/components/custom/Button.tsx';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';

export default function SignIn() {
  const { pathname } = useLocation();
  const { doSignIn } = useAuthenticationContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await doSignIn({ username, password });
  };

  const isAvailable = pathname === '/login';

  return (
    <>
      <Grow in={isAvailable}>
        <Box sx={{ display: isAvailable ? 'flex' : 'none' }} className='flex h-screen justify-center items-center'>
          <Box className='w-[25rem] border-2 border-black rounded p-4'>
            <Box component='form' onSubmit={handleSubmit} className='flex flex-col gap-2 text-center '>
              <TextField value={username} onChange={(e) => setUsername(e.target.value)} placeholder='user' />
              <TextField
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='passw'
              />
              <Button type='submit'>Sign In</Button>
              <Link onClick={() => navigate('/register')} sx={{ color: 'black' }} className='cursor-pointer'>
                Sign up an account
              </Link>
            </Box>
          </Box>
        </Box>
      </Grow>
    </>
  );
}
