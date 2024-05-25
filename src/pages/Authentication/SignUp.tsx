import { Box, Grow, TextField } from '@mui/material';
import Button from '@/components/custom/Button.tsx';
import { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';

export default function SignUp() {
  const { doSignUp } = useAuthenticationContext();
  const { pathname } = useLocation();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await doSignUp({ email, username, password });
  };

  const isAvailable = pathname === '/register';
  const isError =
    !/.+@.+\..+/.test(email) ||
    username.length <= 3 ||
    username.length > 16 ||
    password.length < 5 ||
    password.length > 32 ||
    !/^[a-zA-Z0-9_]+$/.test(username) ||
    password !== passwordConfirmation;

  return (
    <Grow in={pathname === '/register'}>
      <Box sx={{ display: isAvailable ? 'flex' : 'none' }} className='flex h-screen justify-center items-center'>
        <Box className='w-[25rem] border-2 border-black rounded p-4 shadow-custom'>
          <Box component='form' onSubmit={handleSubmit} className='flex flex-col gap-2 text-center '>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='email'
              helperText='set it carefully because if u forget password, u can recover your account'
              error={!!email && !/.+@.+\..+/.test(email)}
            />
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='user'
              helperText='must only contains a-z, A-Z, _, 0-9 and 4 to 16 characters'
              error={!!username && !/^[a-zA-Z0-9_]+$/.test(username)}
            />
            <TextField
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText='must 5 characters or above, lest than or equal 32'
              error={!!password && (password.length < 5 || password.length > 32)}
              placeholder='passw'
            />
            <TextField
              type='password'
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder='passw-conf'
              error={!!passwordConfirmation && password !== passwordConfirmation}
            />
            <Button type='submit' disabled={isError || !username || !password}>
              Sign up
            </Button>
          </Box>
        </Box>
      </Box>
    </Grow>
  );
}
