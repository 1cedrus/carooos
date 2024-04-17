import { Box } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useState } from 'react';
import TextField from '@/components/custom/TextField.tsx';
import MessageCard from '@/pages/Dashboard/UserCard/MessagesBox/MessageCard.tsx';
import { ConversationInfo } from '@/types.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { useNavigate } from 'react-router-dom';

export default function MessagesBox() {
  const navigate = useNavigate();
  const { conversations } = useUserInformationContext();
  const [friendQuery, setFriendQuery] = useState<string>('');

  const handleSelect = (conversation: ConversationInfo) => {
    navigate(`${conversation.cid}`);
    triggerEvent(EventName.ReloadInfo);
  };

  return (
    <Box className='h-full overflow-auto'>
      <Box className='flex flex-col gap-4'>
        <TextField value={friendQuery} onChange={(e) => setFriendQuery(e.target.value)} placeholder='username' />
        <Box className='flex flex-col gap-2'>
          {conversations
            ?.sort((a, b) =>
              a.lastMessage && b.lastMessage
                ? Date.parse(a.lastMessage.timeStamp!) - Date.parse(b.lastMessage.timeStamp!)
                : a.cid - b.cid,
            )
            .map((o) => <MessageCard key={o.cid} conversationInfo={o} onSelect={() => handleSelect(o)} />)}
        </Box>
      </Box>
    </Box>
  );
}
