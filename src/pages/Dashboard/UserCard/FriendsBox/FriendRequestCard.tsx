import { Box, Grow, IconButton } from '@mui/material';
import { Props } from '@/types.ts';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FriendsService from '@/services/FriendsService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';

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
      <Box className='flex justify-between items-center p-1 pl-2 border-[1px] rounded'>
        <Box component='h2' className='w-[5rem]'>
          {username}
        </Box>
        <Box component='h4' className=''>
          {elo}
        </Box>
        <Box className='flex gap-2 items-center'>
          {requested ? (
            <IconButton sx={{ color: 'black' }}>
              <CheckCircleOutlineOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton onClick={doSendRequest} sx={{ color: 'black' }}>
              <AddOutlinedIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Grow>
  );
}
