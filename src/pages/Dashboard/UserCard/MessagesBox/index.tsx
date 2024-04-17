import { Box } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useState } from 'react';
import ChatBox from '@/pages/Dashboard/UserCard/MessagesBox/ChatBox.tsx';
import TextField from '@/components/custom/TextField.tsx';
import MessageCard from '@/pages/Dashboard/UserCard/MessagesBox/MessageCard.tsx';
import { ConversationInfo } from '@/types.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';

export default function MessagesBox() {
  const { conversations } = useUserInformationContext();
  const [target, setTarget] = useState<ConversationInfo>();
  const [friendQuery, setFriendQuery] = useState<string>('');

  const handleSelect = (conversation: ConversationInfo) => {
    setTarget(conversation);
    triggerEvent(EventName.ReloadInfo);
  };

  return (
    <Box className='h-full overflow-auto'>
      {target ? (
        <ChatBox target={target} resetTarget={() => setTarget(undefined)} />
      ) : (
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
      )}
    </Box>
  );
}
