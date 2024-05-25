import { Props } from '@/types.ts';
import { Box, Link, TextField } from '@mui/material';
import Button from '@/components/custom/Button.tsx';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '@/services/AuthService.ts';
import { ResetPasswordSteps } from '@/pages/Authentication/ResetPassword/ResetPasswordStepper.tsx';

interface VerifyEmailProps extends Props {
  email: string;
  token: string;
  setToken: (token: string) => void;
  setActiveStep: (step: number) => void;
}

export default function VerifyEmail({ email, token, setToken, setActiveStep }: VerifyEmailProps) {
  const [onSubmit, setOnSubmit] = useState(false);

  const handleSubmit = async () => {
    try {
      await AuthService.verifyEmail({ email, token });

      setActiveStep(ResetPasswordSteps.ResetPassword);
      setOnSubmit(false);
    } catch (e) {
      toast.error((e as Error).message);
      setOnSubmit(false);
    }
  };

  const reSendVerifyEmail = async () => {
    setOnSubmit(true);
    try {
      await AuthService.getToken({ email });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Box className='flex flex-col gap-2 px-8'>
      <TextField
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder='Enter your verification token'
        fullWidth
        autoFocus
      />
      <Link onClick={reSendVerifyEmail} sx={{ color: 'black', fontSize: '0.8rem' }} className='cursor-pointer '>
        Not receive email? Resend verification email!
      </Link>
      <Button onClick={handleSubmit} disabled={onSubmit || !token}>
        Submit
      </Button>
    </Box>
  );
}
