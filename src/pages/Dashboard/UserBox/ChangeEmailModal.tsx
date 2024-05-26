import { useEffect, useState } from 'react';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { toast } from 'react-toastify';
import { Box, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import DialogTitle from '@/components/custom/DialogTitle.tsx';
import Button from '@/components/custom/Button.tsx';
import UserService from '@/services/UserService.ts';

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { authToken } = useAuthenticationContext();

  useEffect(() => {
    eventEmitter.on(EventName.OpenChangeEmailModal, () => setOpen(true));

    return () => {
      eventEmitter.off(EventName.OpenChangeEmailModal, () => setOpen(true));
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEmail('');
  };

  const handleSubmit = async () => {
    try {
      await UserService.changeEmail(authToken, email);
      toast.success('Email changed successfully!');
      eventEmitter.emit(EventName.ReloadInfo);
      handleClose();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const isError = !!email && !/.+@.+\..+/.test(email);

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
      <DialogTitle onClose={handleClose}>Change Profile Picture</DialogTitle>
      <DialogContent>
        <Box className='my-2 flex flex-col justify-center items-center gap-4'>
          <TextField
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            label='Your new email'
            error={isError}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} disabled={!email || isError}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
