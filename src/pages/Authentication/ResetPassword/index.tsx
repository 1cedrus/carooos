import { useState } from 'react';
import { Box, Grow } from '@mui/material';
import ResetPasswordStepper, {
  ResetPasswordSteps,
} from '@/pages/Authentication/ResetPassword/ResetPasswordStepper.tsx';
import EnterEmail from '@/pages/Authentication/ResetPassword/EnterEmail.tsx';
import VerifyEmail from '@/pages/Authentication/ResetPassword/VerifyEmail.tsx';
import ResetPasswordForm from '@/pages/Authentication/ResetPassword/ResetPasswordForm.tsx';

export default function ResetPassword() {
  const [activeStep, setActiveStep] = useState(ResetPasswordSteps.EnterEmail);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <Grow in={true}>
      <Box className='h-screen flex flex-col justify-center items-center'>
        <Box className='flex flex-col gap-8 py-8 w-[40rem] border-2 border-black shadow-custom rounded bg-white'>
          <ResetPasswordStepper activeStep={activeStep} />
          {activeStep === ResetPasswordSteps.EnterEmail && (
            <EnterEmail email={email} setEmail={setEmail} setActiveStep={setActiveStep} />
          )}
          {activeStep === ResetPasswordSteps.VerifyEmail && (
            <VerifyEmail email={email} setActiveStep={setActiveStep} token={token} setToken={setToken} />
          )}
          {activeStep === ResetPasswordSteps.ResetPassword && (
            <ResetPasswordForm setPassword={setNewPassword} password={newPassword} email={email} token={token} />
          )}
        </Box>
      </Box>
    </Grow>
  );
}
