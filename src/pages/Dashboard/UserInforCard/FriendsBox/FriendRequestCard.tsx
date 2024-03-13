import { Box, IconButton, Grow } from '@mui/material';
import { Props } from '@/types.ts';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';
import useFetch from '@/hooks/useFetch.ts';
import { api } from '@/utils/api.ts';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

interface FriendRequestCardProps extends Props {
  username: string;
  elo: number;
}

export default function FriendRequestCard({ username, elo }: FriendRequestCardProps) {
  const fetch = useFetch();
  const [requested, setRequested] = useState(false);

  const doSendRequest = async () => {
    const response = await fetch(`${api.http}/api/friends/${username}`, {
      method: 'post',
    });

    if (response.status === 202) {
      setRequested(true);
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
