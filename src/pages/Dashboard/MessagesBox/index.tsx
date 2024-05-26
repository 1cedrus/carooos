import { Box } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useState } from 'react';
import TextField from '@/components/custom/TextField.tsx';
import MessageCard from '@/pages/Dashboard/MessagesBox/MessageCard.tsx';
import { ConversationInfo } from '@/types.ts';
import { useNavigate } from 'react-router-dom';

export default function MessagesBox() {
  const navigate = useNavigate();
  const { conversations, setConversations } = useUserInformationContext();
  const [friendQuery, setFriendQuery] = useState<string>('');

  const handleSelect = (conversation: ConversationInfo) => {
    navigate(`${conversation.cid}`);
    setConversations((pre) => pre.map((o) => (o.cid === conversation.cid ? { ...o, seen: true } : o)));
  };

  return (
    <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-custom bg-white'>
      <Box className='flex flex-col gap-4 p-4'>
        <TextField value={friendQuery} onChange={(e) => setFriendQuery(e.target.value)} placeholder='username' />
        <Box className='flex flex-col gap-2'>
          {conversations
            ?.filter((o) => o.peers.includes(friendQuery))
            ?.sort((a, b) =>
              a.lastMessage && b.lastMessage
                ? Date.parse(b.lastMessage.timeStamp!) - Date.parse(a.lastMessage.timeStamp!)
                : a.cid - b.cid,
            )
            .map((o) => <MessageCard key={o.cid} conversationInfo={o} onSelect={() => handleSelect(o)} />)}
        </Box>
      </Box>
    </Box>
  );
}
