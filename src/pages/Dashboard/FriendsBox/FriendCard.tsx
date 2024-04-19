import { Box, IconButton } from '@mui/material';
import { Props } from '@/types.ts';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { ReactNode } from 'react';
import { EmojiEventsOutlined } from '@mui/icons-material';

interface FriendCard extends Props {
  friend: string;
  action: () => void;
  actionIcon: ReactNode;
  hideElo?: boolean;
}

export default function FriendCard({ friend, action, actionIcon, hideElo }: FriendCard) {
  const { username, elo } = usePublicInfo(friend);

  return (
    <Box className='flex justify-between items-center border-[1px] border-black shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset] rounded pl-2 '>
      <Box className='flex justify-between w-[10rem]'>
        <Box component='h2'>{username}</Box>
        {!hideElo && (
          <Box component='h4' className='flex items-centers'>
            {elo}
            <EmojiEventsOutlined fontSize='small' />
          </Box>
        )}
      </Box>
      <Box className='flex gap-2'>
        <IconButton onClick={action} sx={{ color: 'black', borderRadius: '0' }}>
          {actionIcon}
        </IconButton>
      </Box>
    </Box>
  );
}
