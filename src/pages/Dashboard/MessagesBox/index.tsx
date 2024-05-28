import { Box } from '@mui/material';
import { useState } from 'react';
import TextField from '@/components/custom/TextField.tsx';
import MessageCard from '@/pages/Dashboard/MessagesBox/MessageCard.tsx';
import { ConversationInfo } from '@/types.ts';
import { useNavigate } from 'react-router-dom';
import { useMessagesContext } from '@/providers/MessagesProvider.tsx';

export default function MessagesBox() {
  const navigate = useNavigate();
  const { conversations } = useMessagesContext();
  const [friendQuery, setFriendQuery] = useState<string>('');

  const handleSelect = (conversation: ConversationInfo) => {
    navigate(`${conversation.cid}`);
  };

  return (
    <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-custom bg-white'>
      <Box className='flex flex-col gap-4 p-4'>
        <TextField value={friendQuery} onChange={(e) => setFriendQuery(e.target.value)} placeholder='username' />
        <Box className='flex flex-col gap-2 h-[34rem] overflow-auto'>
          {conversations?.length ? (
            conversations
              .filter((o) => o.peers[0].includes(friendQuery))
              .map((o) => <MessageCard key={o.cid} conversationInfo={o} onSelect={() => handleSelect(o)} />)
          ) : (
            <Box className='text-center'>You don't have any conversations now!</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
