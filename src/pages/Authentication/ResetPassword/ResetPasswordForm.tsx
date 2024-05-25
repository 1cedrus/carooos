import { Box, TextField } from '@mui/material';
import { Props } from '@/types.ts';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '@/services/AuthService.ts';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/custom/Button.tsx';

interface ResetPasswordFormProps extends Props {
  email: string;
  token: string;
  password: string;
  setPassword: (password: string) => void;
}

export default function ResetPasswordForm({ password, setPassword, email, token }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const [onSubmit, setOnSubmit] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = async () => {
    try {
      await AuthService.resetPassword({ email, token, newPassword: password });

      setOnSubmit(false);
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Box className='flex flex-col gap-2 px-8'>
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
      <Button onClick={handleSubmit} disabled={onSubmit || !password || password !== passwordConfirmation}>
        Submit
      </Button>
    </Box>
  );
}
