import { Box, Grow, IconButton } from '@mui/material';
import { FriendsMessageType, Props } from '@/types.ts';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

interface FriendCard extends Props {
  friend: string;
}

export default function FriendCard({ friend }: FriendCard) {
  const { username: user } = useUserInformationContext();
  const { username, elo } = usePublicInfo(friend);
  const { stompClient } = useStompClientContext();

  const doInvite = async () => {
    if (!stompClient || !stompClient.connected) return;

    stompClient.send(
      `/user/${username}/topic/friends`,
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteRequest,
        username: user,
      }),
    );
  };

  return (
    <Grow in={true}>
      <Box className='flex justify-between items-center p-1 pl-2 border-[1px] rounded'>
        <Box component='h2' className='w-[5rem]'>
          {username}
        </Box>
        <Box component='h4' className=''>
          {elo}
        </Box>
        <Box className='flex gap-2'>
          <IconButton onClick={doInvite} sx={{ color: 'black' }}>
            <LocalFireDepartmentIcon fontSize='small' />
          </IconButton>
          <IconButton sx={{ color: 'black' }} disabled>
            <MessageOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Grow>
  );
}
