import { Box, LinearProgress, Modal } from '@mui/material';
import User from '@/components/shared/User.tsx';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import Button from '@/components/custom/Button.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

export default function MatchFound() {
  const navigate = useNavigate();
  const { quitQueue } = useStompClientContext();
  const { nextMove } = useGameContext();
  const { setCurrentGame } = useUserInformationContext();
  const [roomCode, setRoomCode] = useState('');
  const [progress, setProgress] = useState(100);
  const [open, setOpen] = useState(false);
  const [onWaiting, setOnWaiting] = useState(false);
  const [firstUser, secondUser] = roomCode.split('-');

  useEffect(() => {
    if (open && progress <= -50) {
      toast.error(
        onWaiting
          ? 'Failed to matching, maybe the other player not accept the match.'
          : 'Out of time to accept the match.',
      );
      setOpen(false);
      setOnWaiting(false);
    }
  }, [progress]);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setProgress((pre) => pre - 5);
    }, 250);

    return () => {
      clearInterval(timer);
    };
  }, [open]);

  useEffect(() => {
    const showPopup = (roomCode: string) => {
      setProgress(100);
      setRoomCode(roomCode);
      setOpen(true);
    };

    eventEmitter.on(EventName.OpenMatchFoundModal, showPopup);

    return () => {
      eventEmitter.off(EventName.OpenMatchFoundModal, showPopup);
    };
  }, []);

  useEffect(() => {
    if (onWaiting && nextMove) {
      setOpen(false);
      setOnWaiting(false);
      quitQueue();
      navigate(`/play`);
    }
  }, [nextMove]);

  const doAccept = () => {
    setOnWaiting(true);
    setCurrentGame(roomCode);
  };

  return (
    <Modal open={open} onClose={() => {}}>
      <Box className='flex flex-col items-center gap-4 border-2 border-black rounded w-[40rem] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white'>
        <Box component='h1' className='text-2xl font-bold pt-4'>
          MATCH FOUND!
        </Box>
        <Box className='flex items-center gap-20 mb-8'>
          <User username={firstUser} />
          <LocalFireDepartmentIcon />
          <User username={secondUser} className='flex-row-reverse' />
        </Box>
        <Box className='w-full'>
          <LinearProgress value={progress} variant='determinate' color='inherit' />
        </Box>
        <Box className='absolute bottom-[-1rem] left-1/2 translate-x-[-50%] flex gap-[10rem]'>
          <Button
            onClick={doAccept}
            disabled={onWaiting}
            textClassName='font-bold text-xl'
            className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset] w-full'>
            Accept
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              quitQueue();
            }}
            disabled={onWaiting}
            textClassName='font-bold text-xl'
            className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset] w-full'>
            Refuse
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
