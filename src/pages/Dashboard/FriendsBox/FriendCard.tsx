import { Avatar, Badge, Box, IconButton } from '@mui/material';
import { FriendInformation, Props } from '@/types.ts';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { ReactNode } from 'react';
import { ChampionIcon } from '@/components/shared/icons.tsx';
import styled from '@emotion/styled';

interface FriendCard extends Props {
  friend: FriendInformation;
  action: () => void;
  actionIcon: ReactNode;
  hideElo?: boolean;
}

export const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px white`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function FriendCard({ friend: { username, isOnline }, action, actionIcon, hideElo }: FriendCard) {
  const { elo, profilePicUrl } = usePublicInfo(username);

  return (
    <Box className='flex justify-between items-center border-[1px] border-black shadow-custom rounded p-2'>
      <Box className='flex justify-between items-center'>
        <Box className='flex gap-2 items-center w-[10rem]'>
          {isOnline ? (
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
            </StyledBadge>
          ) : (
            <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
          )}
          <Box component='h2'>{username}</Box>
        </Box>
        {!hideElo && (
          <Box component='h4' className='flex items-centers gap-1'>
            {elo}
            <ChampionIcon width='1rem' />
          </Box>
        )}
      </Box>
      <Box className='flex gap-2 '>
        <IconButton title='invite to play' disabled={!isOnline} onClick={action} sx={{ color: 'black' }}>
          {actionIcon}
        </IconButton>
      </Box>
    </Box>
  );
}
