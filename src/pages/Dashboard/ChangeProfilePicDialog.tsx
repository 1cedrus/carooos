import { Avatar, Dialog, DialogActions, DialogContent } from '@mui/material';
import DialogTitle from '@/components/custom/DialogTitle.tsx';
import Button from '@/components/custom/Button.tsx';
import { useEffect, useState } from 'react';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import styled from '@emotion/styled';
import { UploadFile } from '@mui/icons-material';
import UserService from '@/services/UserService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';

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

export default function ChangeProfilePicDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { authToken } = useAuthenticationContext();
  const { profilePicUrl } = useUserInformationContext();

  useEffect(() => {
    eventEmitter.on(EventName.OpenChangeProfilePicDialog, () => setOpen(true));

    return () => {
      eventEmitter.off(EventName.OpenChangeProfilePicDialog, () => setOpen(true));
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
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
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent className='flex flex-col justify-center gap-4'>
          <Avatar
            src={file ? URL.createObjectURL(file) : profilePicUrl}
            sx={{ width: 240, height: 240, border: '2px solid black' }}></Avatar>
          <Button component='label' role={undefined} variant='contained' tabIndex={-1} startIcon={<UploadFile />}>
            Upload file
            <VisuallyHiddenInput
              type='file'
              accept='image/*'
              name='image'
              multiple={false}
              onChange={(event) => setFile(event.target.files![0])}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Change</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
