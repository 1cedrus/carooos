import { Box, Grow, TextField } from '@mui/material';
import Button from '@/components/custom/Button.tsx';
import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import Snackbar from '@/components/custom/Snackbar.tsx';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { api } from '@/utils/api.ts';

export default function SignUp() {
  const fetch = useFetch();
  const navigate = useNavigate();
  const { setJsonWebToken, isAuthenticated } = useAuthenticationContext();
  const { pathname } = useLocation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch(`${api.http}/api/auth/register`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        passwordConfirmation,
      }),
    });

    if (response.ok) {
      const { token, error: _ } = await response.json();
      if (token) {
        setJsonWebToken(token);
      } else {
        triggerEvent(EventName.OpenInforSnackBar, "user'z already existed!");
      }
    }
  };

  const isAvailable = pathname === '/register';
  const isError = !/^[a-zA-Z0-9_]+$/.test(username) || password !== passwordConfirmation;

  return (
    <>
      <Grow in={pathname === '/register'}>
        <Box sx={{ display: isAvailable ? 'flex' : 'none' }} className='flex h-screen justify-center items-center'>
          <Box className='w-[25rem] border-2 border-black rounded p-4'>
            <Box component='form' onSubmit={handleSubmit} className='flex flex-col gap-2 text-center '>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='user'
                helperText='must only contains a-z, A-z, _'
                error={!!username && !/^[a-zA-Z0-9_]+$/.test(username)}
              />
              <TextField
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='passw'
              />
              <TextField
                type='password'
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder='passw-conf'
                error={password !== passwordConfirmation}
              />
              <Button type='submit' disabled={isError || !username || !password}>
                Sign up
              </Button>
            </Box>
          </Box>
        </Box>
      </Grow>
      <Snackbar />
    </>
  );
}
