import { Props } from '@/types.ts';
import { Avatar, Box, Grow, IconButton } from '@mui/material';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FriendsService from '@/services/FriendsService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { ChampionIcon } from '@/components/shared/icons.tsx';

interface FriendResponseCardProps extends Props {
  sender: string;
}

export default function FriendResponseCard({ sender }: FriendResponseCardProps) {
  const { authToken } = useAuthenticationContext();
  const { username, elo, profilePicUrl } = usePublicInfo(sender);

  const doAccept = async () => {
    if (await FriendsService.send(username, authToken)) {
      triggerEvent(EventName.ReloadFriends);
    }
  };

  const doRefuse = async () => {
    if (await FriendsService.refuse(username!, authToken)) {
      triggerEvent(EventName.ReloadFriends);
      triggerEvent(EventName.ReloadConversation);
    }
  };

  return (
    <Grow in={true}>
      <Box className='flex justify-between items-center p-2 border-2 border-black rounded shadow-custom'>
        <Box className='flex justify-between items-center'>
          <Box className='flex gap-2 items-center w-[10rem]'>
            <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
            <Box component='h2'>{username}</Box>
          </Box>
          <Box component='h4' className='flex items-centers gap-1'>
            {elo}
            <ChampionIcon width='1rem' />
          </Box>
        </Box>
        <Box className='flex items-center gap-2'>
          <IconButton onClick={doAccept} sx={{ color: 'black' }}>
            <CheckOutlinedIcon fontSize='small' />
          </IconButton>
          <IconButton onClick={doRefuse} sx={{ color: 'black' }}>
            <CloseOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Grow>
  );
}
