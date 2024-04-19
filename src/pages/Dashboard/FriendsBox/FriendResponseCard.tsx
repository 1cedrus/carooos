import { Props } from '@/types.ts';
import { Box, Grow, IconButton } from '@mui/material';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FriendsService from '@/services/FriendsService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { EmojiEventsOutlined } from '@mui/icons-material';

interface FriendResponseCardProps extends Props {
  sender: string;
}

export default function FriendResponseCard({ sender }: FriendResponseCardProps) {
  const { authToken } = useAuthenticationContext();
  const { username, elo } = usePublicInfo(sender);

  const doAccept = async () => {
    if (await FriendsService.send(username, authToken)) {
      triggerEvent(EventName.ReloadInfo);
    }
  };

  const doRefuse = async () => {
    if (await FriendsService.refuse(username!, authToken)) {
      triggerEvent(EventName.ReloadInfo);
    }
  };

  return (
    <Grow in={true}>
      <Box className='flex justify-between items-center pl-2 border-2 border-black rounded shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
        <Box className='flex justify-between w-[10rem]'>
          <Box component='h2'>{username}</Box>
          <Box component='h4'>
            {elo}
            <EmojiEventsOutlined fontSize='small' />
          </Box>
        </Box>
        <Box className='flex  items-center'>
          <IconButton onClick={doAccept} sx={{ color: 'black', borderRadius: 0 }}>
            <CheckOutlinedIcon fontSize='small' />
          </IconButton>
          <IconButton onClick={doRefuse} sx={{ color: 'black', borderRadius: 0 }}>
            <CloseOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Grow>
  );
}
