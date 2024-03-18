import { Props } from '@/types.ts';
import { Box, Grow, IconButton } from '@mui/material';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FriendsService from '@/services/FriendsService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';

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
      <Box className='flex justify-between items-center p-1 pl-2 border-[1px] rounded border-amber-300'>
        <Box component='h2' className='w-[5rem]'>
          {username}
        </Box>
        <Box component='h4' className=''>
          {elo}
        </Box>
        <Box className='flex gap-2 items-center'>
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
