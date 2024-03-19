import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useNavigate } from 'react-router-dom';

export default function WinnerAnnouncement() {
  const navigate = useNavigate();
  const [navigateTo, setNavigateTo] = useState<string>();
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState<string>();

  useEffect(() => {
    const showPopup = (winner: string, navigateTo?: string) => {
      setWinner(winner);
      setNavigateTo(navigateTo);
      setOpen(true);
    };
    eventEmitter.on(EventName.OpenWinnerAnnouncementModal, showPopup);

    return () => {
      eventEmitter.off(EventName.OpenWinnerAnnouncementModal, showPopup);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
    if (navigateTo) navigate(navigateTo);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='text-2xl font-bold rounded absolute top-1/2 left-1/2 bg-white p-4 w-[20rem] text-center translate-x-[-50%] translate-y-[-50%]'>
        {winner && `The winner is ${winner}`}
      </Box>
    </Modal>
  );
}
