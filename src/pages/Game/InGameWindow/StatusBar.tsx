import { Box } from '@mui/material';
import User from '@/components/shared/User.tsx';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { ArrowDownDoubleIcon, ArrowUpDoubleIcon, MessageIcon } from '@/components/shared/icons.tsx';
import { useEffect, useState } from 'react';
import { useToggle } from 'react-use';
import MessageButton from '@/pages/Game/InGameWindow/MessageButton.tsx';

export default function StatusBar() {
  const { nextMove, firstUser, secondUser, lastMoveTimeStamp, inGameChat } = useGameContext();
  const [time, setTime] = useState(lastMoveTimeStamp);
  const [showChat, toggleChat] = useToggle(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [lastMoveTimeStamp]);

  useEffect(() => {
    setTime(Math.floor((lastMoveTimeStamp + 60 * 1000 - Date.now()) / 1000));
  }, [lastMoveTimeStamp]);

  return (
    <Box className='flex flex-col gap-2 justify-between h-full z-20'>
      <Box className='flex flex-col gap-2 w-fit'>
        <Box className='p-2 border-2 border-black rounded-2xl shadow-custom bg-white'>
          <Box className='flex flex-col justify-center items-center gap-8'>
            <User username={firstUser} hideInfo />
            {firstUser === nextMove ? <ArrowUpDoubleIcon /> : <ArrowDownDoubleIcon />}
            <User username={secondUser} hideInfo />
          </Box>
        </Box>
        <Box className='border-2 border-black bg-white shadow-custom rounded-2xl w-full text-center p-2  font-bold'>{`${String(time).padStart(2, '0')}`}</Box>
      </Box>
      <Box className='flex flex-col gap-2'>
        <Box className='h-[15rem] flex flex-col-reverse overflow-clip w-[15rem]'>
          {inGameChat?.map((message, index) => (
            <Box key={index} className='flex gap-2'>
              <Box className='font-bold'>{message.sender}:</Box>
              <Box>{message.content}</Box>
            </Box>
          ))}
        </Box>
        <Box className='flex gap-2'>
          <Box
            component='button'
            onClick={toggleChat}
            className='shadow-custom border-2 border-black bg-white rounded-2xl  flex justify-center p-2 '>
            <MessageIcon />
          </Box>
          <Box className={`flex-auto ${showChat ? 'visible' : 'invisible'}`}>
            <MessageButton />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
