import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useNavigate } from 'react-router-dom';

export default function DrawAnnouncement() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [navigateTo, setNavigateTo] = useState<string>();

  useEffect(() => {
    const showPopup = (navigateTo?: string) => {
      setNavigateTo(navigateTo);
      setOpen(true);
    };
    eventEmitter.on(EventName.OpenDrawAnnouncementModal, showPopup);

    return () => {
      eventEmitter.off(EventName.OpenDrawAnnouncementModal, showPopup);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
    if (navigateTo) navigate(navigateTo);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='text-2xl font-bold rounded absolute top-1/2 left-1/2 bg-white p-4 w-[20rem] text-center translate-x-[-50%] translate-y-[-50%]'>
        This game is Draw
      </Box>
    </Modal>
  );
}
