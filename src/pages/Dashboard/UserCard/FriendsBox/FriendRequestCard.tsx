import { Box, Grow, IconButton } from '@mui/material';
import { Props } from '@/types.ts';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FriendsService from '@/services/FriendsService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';
import { EmojiEventsOutlined } from '@mui/icons-material';

interface FriendRequestCardProps extends Props {
  username: string;
  elo: number;
}

export default function FriendRequestCard({ username, elo }: FriendRequestCardProps) {
  const { authToken } = useAuthenticationContext();
  const [requested, setRequested] = useState(false);

  const doSendRequest = async () => {
    if (await FriendsService.send(username, authToken)) {
      setRequested(true);
    } else {
      toast.error('Some error occurred!');
    }
  };

  return (
    <Grow in={true}>
      <Box className='flex justify-between items-center pl-2 border-[1px] rounded'>
        <Box className='flex justify-between w-[10rem]'>
          <Box component='h2'>{username}</Box>
          <Box component='h4'>
            {elo}
            <EmojiEventsOutlined fontSize='small' />
          </Box>
        </Box>
        <Box className='flex gap-2 items-center'>
          {requested ? (
            <IconButton sx={{ color: 'black' }}>
              <CheckCircleOutlineOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton onClick={doSendRequest} sx={{ color: 'black', borderRadius: 0 }}>
              <AddOutlinedIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Grow>
  );
}
