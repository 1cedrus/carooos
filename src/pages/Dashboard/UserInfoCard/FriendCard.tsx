import { Box, Grow, IconButton } from '@mui/material';
import { Props } from '@/types.ts';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { ReactNode } from 'react';

interface FriendCard extends Props {
  friend: string;
  action: () => void;
  actionIcon: ReactNode;
}

export default function FriendCard({ friend, action, actionIcon }: FriendCard) {
  const { username, elo } = usePublicInfo(friend);

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
          <IconButton onClick={action} sx={{ color: 'black' }}>
            {actionIcon}
          </IconButton>
        </Box>
      </Box>
    </Grow>
  );
}
