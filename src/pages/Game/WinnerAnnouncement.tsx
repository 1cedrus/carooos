import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { useNavigate } from 'react-router-dom';

export default function WinnerAnnouncement() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { winner } = useGameContext();

  useEffect(() => {
    const showModal = () => setOpen(true);
    eventEmitter.on(EventName.OpenWinnerAnnouncementModal, showModal);

    return () => {
      eventEmitter.off(EventName.OpenWinnerAnnouncementModal, showModal);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
    navigate('/dashboard');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='text-2xl font-bold rounded absolute top-1/2 left-1/2 bg-white p-4 w-[20rem] text-center translate-x-[-50%] translate-y-[-50%]'>{`The winner is ${winner}`}</Box>
    </Modal>
  );
}
