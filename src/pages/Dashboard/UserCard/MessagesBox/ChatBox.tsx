import { ChatMessage, Props } from '@/types.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ChatService from '@/services/ChatService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import useAsync from '@/hooks/useAsync.ts';
import { Box, Divider, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import Message from '@/pages/Dashboard/UserCard/MessagesBox/Message.tsx';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { topics } from '@/utils/topics.ts';

interface ChatBoxProps extends Props {
  target: string;
  resetTarget: () => void;
}

export default function ChatBox({ target, resetTarget }: ChatBoxProps) {
  const { authToken } = useAuthenticationContext();
  const { username } = useUserInformationContext();
  const { stompClient } = useStompClientContext();
  const [currentMsgs, setCurrentMsgs] = useState<ChatMessage[]>([]);
  const [msg, setMsg] = useState<string>();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const sub = stompClient?.subscribe(topics.MESSAGES, (message) => {
      const chatMessage = JSON.parse(message.body) as ChatMessage;

      if (chatMessage.sender === target) {
        setCurrentMsgs((pre) => [...pre, chatMessage]);
      } else if (chatMessage.sender === username && chatMessage.receiver === target) {
        setCurrentMsgs((pre) => [...pre, chatMessage]);
      }
    });

    return () => {
      sub?.unsubscribe();
    };
  }, []);

  useAsync(async () => {
    try {
      const chatMessages: ChatMessage[] = await ChatService.listSpecificMessages(target, authToken);

      chatMessages.sort((a, b) => Date.parse(a.timeStamp!) - Date.parse(b.timeStamp!));

      setCurrentMsgs(chatMessages);
    } catch (_) {}
  }, [target]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const chatMessage: ChatMessage = {
      sender: username,
      receiver: target,
      content: msg,
    };

    if (await ChatService.sendMessage(chatMessage, authToken)) {
      setMsg('');
    }
  };

  useEffect(() => {
    ref.current?.scroll(0, ref.current?.scrollHeight);
  }, [currentMsgs]);

  return (
    <Box className='h-full flex flex-col border-2 rounded px-2 '>
      <Box className='flex-initial flex justify-between items-center'>
        <Box component='h2' className='text-xl'>
          {target}
        </Box>
        <IconButton onClick={resetTarget} sx={{ color: 'black' }}>
          <ArrowBackOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>
      <Divider />
      <Box ref={ref} className='flex-auto flex flex-col gap-2 overflow-auto p-2'>
        {currentMsgs.map(({ content, timeStamp, sender }) => (
          <Message
            key={content! + timeStamp!}
            msg={content!}
            className={sender === username ? 'self-end rounded-l-2xl' : 'self-start rounded-r-2xl'}
          />
        ))}
      </Box>
      <Box component='form' onSubmit={sendMessage} className='flex-initial flex gap-2 my-2'>
        <OutlinedInput
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          fullWidth
          placeholder='messagezz go here'
          size='small'
          sx={{ pr: '0.2rem' }}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton type='submit' sx={{ color: 'black' }}>
                <ArrowForwardOutlinedIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Box>
  );
}
