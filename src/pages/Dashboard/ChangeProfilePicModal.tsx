import { Avatar, Dialog, DialogActions, DialogContent } from '@mui/material';
import DialogTitle from '@/components/custom/DialogTitle.tsx';
import { useEffect, useState } from 'react';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import styled from '@emotion/styled';
import UserService from '@/services/UserService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';
import Button from '@/components/custom/Button.tsx';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ChangeProfilePicModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { authToken } = useAuthenticationContext();
  const { profilePicUrl } = useUserInformationContext();

  useEffect(() => {
    eventEmitter.on(EventName.OpenChangeProfilePicModal, () => setOpen(true));

    return () => {
      eventEmitter.off(EventName.OpenChangeProfilePicModal, () => setOpen(true));
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      await UserService.setProfilePic(authToken, file);
      toast.success('Profile picture changed successfully');
      eventEmitter.emit(EventName.ReloadInfo);
    } catch (e) {
      toast.error((e as Error).message);
    }

    setOpen(false);
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
      <DialogTitle onClose={handleClose}>Change Profile Picture</DialogTitle>
      <DialogContent className='flex flex-col justify-center items-center gap-4'>
        <Avatar
          src={file ? URL.createObjectURL(file) : profilePicUrl}
          sx={{ width: 240, height: 240, border: '2px solid black' }}></Avatar>
      </DialogContent>
      <DialogActions>
        <Button component='label' role={undefined} tabIndex={-1}>
          Upload Photo
          <VisuallyHiddenInput
            type='file'
            accept='image/*'
            name='image'
            multiple={false}
            onChange={(event) => setFile(event.target.files![0])}
          />
        </Button>
        <Button onClick={handleSubmit} disabled={!file}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
