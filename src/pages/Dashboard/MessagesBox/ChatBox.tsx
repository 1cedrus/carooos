import { ChatMessage, ConversationInfo, Pagination, Props } from '@/types.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ConversationService from '@/services/ConversationService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { Avatar, Box, CircularProgress, IconButton } from '@mui/material';
import Message from '@/pages/Dashboard/MessagesBox/Message.tsx';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@/components/custom/TextField.tsx';
import { useMessagesContext } from '@/providers/MessagesProvider.tsx';
import { toast } from 'react-toastify';
import { useAsync, useScroll } from 'react-use';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { StyledBadge } from '@/pages/Dashboard/FriendsBox/FriendCard.tsx';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { useFriendsContext } from '@/providers/FriendsProvider.tsx';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

export default function ChatBox() {
  const { stompClient } = useStompClientContext();
  const { cid } = useParams();
  const [target, setTarget] = useState<ConversationInfo>();
  const { conversations, setConversations } = useMessagesContext();

  useEffect(() => {
    if (!stompClient || !stompClient.connected || !target) return;

    stompClient.subscribe(`/topic/messages/${target.cid}`, () => {});

    return () => {
      stompClient.unsubscribe(`/topic/messages/${target.cid}`);
    };
  }, [stompClient, target]);

  useEffect(() => {
    if (target || !conversations) return;

    setConversations!((pre) => pre.map((one) => (one.cid !== Number(cid) ? one : { ...one, numberOfUnseen: 0 })));
    setTarget(conversations.find((o) => o.cid === Number(cid)));
  }, [cid, conversations]);

  if (!target) return null;

  return <ChatView conversation={target} />;
}

interface ChatViewProps extends Props {
  conversation: ConversationInfo;
}

function ChatView({ conversation: { cid, peers } }: ChatViewProps) {
  const navigate = useNavigate();
  const { friends } = useFriendsContext();
  const { profilePicUrl, username: peer } = usePublicInfo(peers[0]);
  const { username } = useUserInformationContext();
  const { authToken } = useAuthenticationContext();
  const ref = useRef<HTMLElement | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [nonce, _setNonce] = useState(Date.now());
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const { y } = useScroll(ref);

  useAsync(async () => {
    const { items, hasNextPage } = (await ConversationService.listConversationMessages(
      pageIndex,
      15,
      nonce,
      authToken,
      Number(cid),
    )) as Pagination<ChatMessage>;

    items.sort((a, b) => Date.parse(a.timeStamp!) - Date.parse(b.timeStamp!));

    setCurrentMessages((pre) => [...items, ...pre]);
    setHasNextPage(hasNextPage);
    setOnLoading(false);

    setIsLoad(true);
  }, [pageIndex]);

  useEffect(() => {
    const onMessage = async (message: ChatMessage) => {
      if (message.conversation === cid) {
        setCurrentMessages((pre) => [...pre, message]);
      }

      setIsLoad(false);
    };

    eventEmitter.on(EventName.OnTopicMessages, onMessage);

    return () => {
      eventEmitter.off(EventName.OnTopicMessages, onMessage);
    };
  }, []);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!msg.trim()) {
      setMsg('');
      return;
    }

    const rawMessage = { content: msg };
    setMsg('');

    try {
      await ConversationService.sendMessage(cid, rawMessage, authToken);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => {
    if (!isLoad || (isLoad && !pageIndex)) {
      ref.current?.scrollTo(0, ref.current?.scrollHeight);
    }
  }, [currentMessages]);

  useEffect(() => {
    if (!onLoading && y < 100 && hasNextPage) {
      setPageIndex((pre) => pre + 1);
      setOnLoading(true);
    }
  }, [y]);

  const isOnline = friends?.find((o) => o.username === peer)?.isOnline;

  return (
    <Box className='h-[40rem] w-[45rem] p-4 border-2 border-black rounded-2xl shadow-custom flex flex-col bg-white'>
      <Box className='flex justify-between items-center'>
        <Box className='flex gap-2 items-center w-[10rem]'>
          {isOnline ? (
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
            </StyledBadge>
          ) : (
            <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
          )}
          <Box component='h2' className='font-bold'>
            {peer}
          </Box>
        </Box>
        <IconButton
          onClick={() => navigate('/messages')}
          className='shadow-custom'
          type='submit'
          sx={{ color: 'black', border: '1px solid black' }}>
          <ArrowBackOutlinedIcon />
        </IconButton>
      </Box>
      <Box ref={ref} className='h-full overflow-y-auto border-[1px] border-black rounded my-2 '>
        <Box className='h-full flex flex-col gap-2 p-2'>
          {onLoading && <CircularProgress />}
          {currentMessages.length === 0 && <Box className='text-center'>No messages</Box>}
          {currentMessages.map(({ content, timeStamp, sender }) => (
            <Message
              key={content! + timeStamp!}
              msg={content!}
              timeStamp={timeStamp!}
              className={sender === username ? 'self-end rounded-l-2xl' : 'self-start rounded-r-2xl bg-gray-200'}
            />
          ))}
          <Box className='pt-2'></Box>
        </Box>
      </Box>
      <Box component='form' onSubmit={sendMessage} className='flex gap-2'>
        <TextField value={msg} onChange={(e) => setMsg(e.target.value)} placeholder='Type a messages...' />
        <IconButton className='shadow-custom' type='submit' sx={{ color: 'black', border: '1px solid black' }}>
          <ArrowForwardOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
