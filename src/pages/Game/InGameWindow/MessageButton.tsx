import { Box, IconButton, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { GameMessageType, InGameChatMessage } from '@/types.ts';
import { topics } from '@/utils/topics.ts';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

export default function MessageButton() {
  const { roomCode } = useGameContext();
  const { stompClient } = useStompClientContext();
  const { username } = useUserInformationContext();
  const [message, setMessage] = useState<string>();

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (!message || !username) return;

    const sendMessage: InGameChatMessage = {
      type: GameMessageType.InGameChat,
      sender: username,
      content: message,
    };
    stompClient?.send(topics.GAME(roomCode), {}, JSON.stringify(sendMessage));

    setMessage('');
  };

  return (
    <Box className='lg:w-[40rem]'>
      <Box component='form' onSubmit={sendMessage} className='flex gap-2'>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          placeholder='messagezz go here'
          size='small'
        />
        <IconButton
          type='submit'
          sx={{ color: 'black', borderRadius: '5px', border: '1px solid gray', p: '0.25rem', px: '0.4rem' }}>
          <MessageOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
