import { Box, IconButton } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { GameMessageType, InGameChatMessage } from '@/types.ts';
import { topics } from '@/utils/topics.ts';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import TextField from '@/components/custom/TextField.tsx';

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
    <Box>
      <Box component='form' onSubmit={sendMessage} className='flex gap-2'>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} placeholder='messagezz go here' />
        <IconButton
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          type='submit'
          sx={{ color: 'black', borderRadius: '5px', border: '1px solid black', p: '0.25rem', px: '0.4rem' }}>
          <MessageOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
