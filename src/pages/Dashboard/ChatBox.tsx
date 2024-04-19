import { ChatMessage, ConversationInfo, Pagination } from '@/types.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ChatService from '@/services/ChatService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import useAsync from '@/hooks/useAsync.ts';
import { Box, IconButton } from '@mui/material';
import Message from '@/pages/Dashboard/MessagesBox/Message.tsx';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@/components/custom/TextField.tsx';

export default function ChatBox() {
  const navigate = useNavigate();
  const { cid } = useParams();
  const { authToken } = useAuthenticationContext();
  const { username, conversations } = useUserInformationContext();
  const [currentMsgs, setCurrentMsgs] = useState<ChatMessage[]>([]);
  const [msg, setMsg] = useState<string>();
  const ref = useRef<HTMLElement | null>(null);
  const [target, setTarget] = useState<ConversationInfo>();

  useEffect(() => {
    if (target || !conversations) return;
    setTarget(conversations.find((o) => o.cid === Number(cid)));
  }, [cid, conversations]);

  useEffect(() => {
    if (!target) return;

    const onMessage = async (message: ChatMessage) => {
      if (message.conversation === target.cid) {
        setCurrentMsgs((pre) => [...pre, message]);

        // Update seen on the server
        await ChatService.listConversationMessages(target.cid, authToken, 0, 1);
      }
    };
    eventEmitter.on(EventName.OnTopicMessages, onMessage);

    return () => {
      eventEmitter.off(EventName.OnTopicMessages, onMessage);
    };
  }, [target]);

  useAsync(async () => {
    if (!target) return;

    try {
      const { items }: Pagination<ChatMessage> = await ChatService.listConversationMessages(target.cid, authToken);

      items.sort((a, b) => Date.parse(a.timeStamp!) - Date.parse(b.timeStamp!));

      setCurrentMsgs((pre) => [...items, ...pre]);
    } catch (_) {}
  }, [target]);

  const sendMessage = async (e: FormEvent) => {
    if (!target) return;

    e.preventDefault();

    const chatMessage: ChatMessage = {
      sender: username,
      conversation: target.cid,
      content: msg,
    };

    if (await ChatService.sendMessage(chatMessage, authToken)) {
      setMsg('');
    }
  };

  useEffect(() => {
    ref.current?.scroll(0, ref.current?.scrollHeight);
  }, [currentMsgs]);

  useEffect(() => {}, []);

  if (!target) return null;

  return (
    <Box className='h-[40rem] w-[45rem] p-4 border-2 border-black rounded-2xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset] flex flex-col'>
      <Box className='flex justify-between items-center'>
        <Box component='h2' className='text-xl font-bold'>
          {target.peers[0]}
        </Box>
        <IconButton
          onClick={() => navigate('/messages')}
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          type='submit'
          sx={{ color: 'black', borderRadius: '5px', border: '1px solid black', p: '0.25rem', px: '0.4rem' }}>
          <ArrowBackOutlinedIcon />
        </IconButton>
      </Box>
      <Box
        ref={ref}
        className='h-[32rem] flex flex-col border-[1px] border-black rounded-xl gap-2 p-2 my-2 overflow-auto'>
        {currentMsgs.map(({ content, timeStamp, sender }) => (
          <Message
            key={content! + timeStamp!}
            msg={content!}
            className={sender === username ? 'self-end rounded-l-2xl' : 'self-start rounded-r-2xl'}
          />
        ))}
      </Box>
      <Box component='form' onSubmit={sendMessage} className='flex gap-2'>
        <TextField value={msg} onChange={(e) => setMsg(e.target.value)} placeholder='messagezz go here' />
        <IconButton
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          type='submit'
          sx={{ color: 'black', borderRadius: '5px', border: '1px solid black', p: '0.25rem', px: '0.4rem' }}>
          <ArrowForwardOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
