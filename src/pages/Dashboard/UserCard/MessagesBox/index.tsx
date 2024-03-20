import { Box } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import FriendCard from '@/pages/Dashboard/UserCard/FriendCard.tsx';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useState } from 'react';
import ChatBox from '@/pages/Dashboard/UserCard/MessagesBox/ChatBox.tsx';
import TextField from '@/components/custom/TextField.tsx';

export default function MessagesBox() {
  const { friends } = useUserInformationContext();
  const [target, setTarget] = useState<string>();
  const [friendQuery, setFriendQuery] = useState<string>('');

  return (
    <Box className='h-full overflow-auto'>
      {target ? (
        <ChatBox target={target} resetTarget={() => setTarget('')} />
      ) : (
        <Box className='flex flex-col gap-4'>
          <TextField value={friendQuery} onChange={(e) => setFriendQuery(e.target.value)} placeholder='username' />
          <Box className='flex flex-col gap-2'>
            {friends
              ?.filter((friend) => friend.includes(friendQuery))
              ?.map((friend) => (
                <FriendCard
                  key={friend}
                  friend={friend}
                  action={() => setTarget(friend)}
                  actionIcon={<MessageOutlinedIcon />}
                />
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
