import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import DialogTitle from '@/components/custom/DialogTitle.tsx';
import Button from '@/components/custom/Button.tsx';

export default function SettingDialog() {
  const [open, setOpen] = useState(false);
  const { doLogout } = useAuthenticationContext();

  useEffect(() => {
    const showDialog = () => setOpen(true);
    eventEmitter.on(EventName.OpenSettingsDialog, showDialog);

    return () => {
      eventEmitter.off(EventName.OpenSettingsDialog, showDialog);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth='sm' onClose={onClose}>
      <DialogTitle onClose={onClose}>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={doLogout}>Logout</Button>
      </DialogActions>
    </Dialog>
  );
}
