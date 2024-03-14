import { ReactNode, useEffect, useState } from 'react';
import { Snackbar as MuiSnackbar } from '@mui/material';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';

export default function Snackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState<ReactNode>();

  useEffect(() => {
    const showBar = (message: string, action?: ReactNode) => {
      setMessage(message);
      setAction(action);
      setOpen(true);
    };
    eventEmitter.on(EventName.OpenInforSnackBar, showBar);

    return () => {
      eventEmitter.off(EventName.OpenInforSnackBar, showBar);
    };
  }, []);

  const onClose = () => {
    setMessage('');
    setOpen(false);
  };

  return (
    <MuiSnackbar
      open={open}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      autoHideDuration={5000}
      onClose={onClose}
      message={message}
      action={action}
    />
  );
}
