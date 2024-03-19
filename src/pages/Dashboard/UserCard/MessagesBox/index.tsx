import { Box } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import FriendCard from '@/pages/Dashboard/UserCard/FriendCard.tsx';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useState } from 'react';
import ChatBox from '@/pages/Dashboard/UserCard/MessagesBox/ChatBox.tsx';

export default function MessagesBox() {
  const { friends } = useUserInformationContext();
  const [target, setTarget] = useState<string>();

  return (
    <Box className='h-full overflow-auto'>
      {target ? (
        <ChatBox target={target} resetTarget={() => setTarget('')} />
      ) : (
        <Box className='flex flex-col gap-2'>
          {friends?.map((friend) => (
            <FriendCard
              key={friend}
              friend={friend}
              action={() => setTarget(friend)}
              actionIcon={<MessageOutlinedIcon />}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
