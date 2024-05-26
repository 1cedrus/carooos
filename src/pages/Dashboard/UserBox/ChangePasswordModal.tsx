import { useEffect, useState } from 'react';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { toast } from 'react-toastify';
import { Box, Dialog, DialogContent, TextField } from '@mui/material';
import DialogTitle from '@/components/custom/DialogTitle.tsx';
import Button from '@/components/custom/Button.tsx';
import AuthService from '@/services/AuthService.ts';

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { authToken } = useAuthenticationContext();

  useEffect(() => {
    eventEmitter.on(EventName.OpenChangePasswordModal, () => setOpen(true));

    return () => {
      eventEmitter.off(EventName.OpenChangePasswordModal, () => setOpen(true));
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setOldPassword('');
    setPassword('');
    setPasswordConfirmation('');
  };

  const handleSubmit = async () => {
    try {
      await AuthService.changePassword({ oldPassword, newPassword: password }, authToken);
      toast.success('Password has been changed successfully');
      handleClose();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          border: '2px solid black',
          boxShadow: '0px -3px 0px 0px rgba(17,18,38,0.20) inset',
        },
      }}
      maxWidth={'xs'}
      fullWidth>
      <DialogTitle onClose={handleClose}>Change Password</DialogTitle>
      <DialogContent>
        <Box className='my-2 flex flex-col justify-center items-center gap-4'>
          <TextField
            type='password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            placeholder='Your current password'
          />
          <TextField
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText='must 5 characters or above, lest than or equal 32'
            fullWidth
            error={!!password && (password.length < 5 || password.length > 32)}
            placeholder='New password'
          />
          <TextField
            type='password'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            fullWidth
            placeholder='Retype new password'
            error={!!passwordConfirmation && password !== passwordConfirmation}
          />
          <Button
            className='self-end'
            onClick={handleSubmit}
            disabled={!password || password !== passwordConfirmation}
            fullWidth>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
