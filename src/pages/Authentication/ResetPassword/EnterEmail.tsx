import { Box, TextField } from '@mui/material';
import { Props } from '@/types.ts';
import AuthService from '@/services/AuthService.ts';
import { toast } from 'react-toastify';
import { ResetPasswordSteps } from '@/pages/Authentication/ResetPassword/ResetPasswordStepper.tsx';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

interface EnterEmailProps extends Props {
  email: string;
  setEmail: (email: string) => void;
  setActiveStep: (step: number) => void;
}

export default function EnterEmail({ email, setEmail, setActiveStep }: EnterEmailProps) {
  const [onSubmit, setOnSubmit] = useState(false);

  const handleSubmit = async () => {
    setOnSubmit(true);
    try {
      await AuthService.getToken({ email });

      setActiveStep(ResetPasswordSteps.VerifyEmail);
      setOnSubmit(false);
    } catch (e) {
      toast.error((e as Error).message);
      setOnSubmit(false);
    }
  };

  return (
    <Box className='flex flex-col gap-2 px-8'>
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter your recovery email'
        fullWidth
        autoFocus
        error={!!email && !/.+@.+\..+/.test(email)}
      />
      <LoadingButton
        className='shadow-custom'
        variant='outlined'
        sx={{ bgcolor: 'white', borderColor: 'black', color: 'black', '&:hover': { bgcolor: 'white' } }}
        onClick={handleSubmit}
        disabled={!email || !/.+@.+\..+/.test(email)}
        loading={onSubmit}
        loadingIndicator='Verifying...'>
        Submit
      </LoadingButton>
    </Box>
  );
}
