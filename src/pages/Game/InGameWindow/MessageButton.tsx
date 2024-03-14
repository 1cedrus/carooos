import { Box, FormControl, IconButton, InputAdornment, OutlinedInput, Zoom } from '@mui/material';
import { FormEvent, useState } from 'react';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useGameContext } from '@/providers/GameProvider.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { GameMessageType, MessagesMessage } from '@/types.ts';

export default function MessageButton() {
  const { id } = useGameContext();
  const { stompClient } = useStompClientContext();
  const { username } = useUserInformationContext();
  const [message, setMessage] = useState<string>();
  const [show, setShow] = useState(false);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (!message) return;

    const sendMessage: MessagesMessage = {
      type: GameMessageType.Messages,
      sender: username!,
      content: message,
    };

    stompClient?.send(`/topic/game/${id}`, {}, JSON.stringify(sendMessage));

    setMessage('');
  };

  return (
    <Box className='flex gap-2 md:w-[40rem]'>
      <IconButton
        onClick={() => setShow((pre) => !pre)}
        sx={{ color: 'black', border: '1px solid black', borderRadius: '5px' }}>
        <MessageOutlinedIcon fontSize='small' />
      </IconButton>
      <Zoom in={show} className='flex flex-auto gap-2'>
        <Box component='form' onSubmit={sendMessage}>
          <FormControl>
            <OutlinedInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              placeholder='messagezz go here'
              size='small'
              sx={{ pr: 0 }}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton type='submit' sx={{ color: 'black' }}>
                    <SendIcon fontSize='small' />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Zoom>
    </Box>
  );
}
