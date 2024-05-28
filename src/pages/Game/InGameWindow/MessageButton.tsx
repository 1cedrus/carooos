import { Box, Button } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { GameMessageType, InGameChatMessage } from '@/types.ts';
import { topics } from '@/utils/topics.ts';
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
    <Box component='form' onSubmit={sendMessage} className='flex-auto flex w-[15rem] '>
      <TextField
        value={message}
        className='border-2 border-black rounded-2xl p-2 w-full'
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Type messages...'
      />
      <Button type='submit' className='hidden' />
    </Box>
  );
}
