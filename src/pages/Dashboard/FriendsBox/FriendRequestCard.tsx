import { Avatar, Box, Grow, IconButton } from '@mui/material';
import { Props } from '@/types.ts';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FriendsService from '@/services/FriendsService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';
import { ChampionIcon } from '@/components/shared/icons.tsx';
import { IMAGE_URL } from '@/utils/api.ts';

interface FriendRequestCardProps extends Props {
  username: string;
  elo: number;
  profilePicUrl: string;
}

export default function FriendRequestCard({ username, elo, profilePicUrl }: FriendRequestCardProps) {
  const { authToken } = useAuthenticationContext();
  const [requested, setRequested] = useState(false);

  const doSendRequest = async () => {
    if (requested) return;

    if (await FriendsService.send(username, authToken)) {
      setRequested(true);
    } else {
      toast.error('Some error occurred!');
    }
  };

  return (
    <Grow in={true}>
      <Box className='flex justify-between items-center p-2 border-[1px] border-black rounded shadow-custom'>
        <Box className='flex justify-between items-center'>
          <Box className='flex gap-2 items-center w-[10rem]'>
            <Avatar src={`${IMAGE_URL}/${profilePicUrl}`} sx={{ border: '1px solid black' }} />
            <Box component='h2'>{username}</Box>
          </Box>
          <Box component='h4' className='flex items-centers gap-1'>
            {elo}
            <ChampionIcon width='1rem' />
          </Box>
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
