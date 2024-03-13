import { Props } from '@/types.ts';
import usePublicInformation from '@/hooks/usePublicInformation.ts';
import { Avatar, Box, useMediaQuery } from '@mui/material';

interface UserProps extends Props {
  username?: string;
}

export default function User({ className, username }: UserProps) {
  const { elo } = usePublicInformation(username!);
  const largeScreen = useMediaQuery('(min-width:640px)');

  return (
    <Box className={`flex items-center gap-4 ${className}`}>
      <Avatar sx={{ width: largeScreen ? 60 : 40, height: largeScreen ? 60 : 40, border: '2px solid black' }}></Avatar>
      <Box className='flex w-full flex-col'>
        <Box component='h2' className='md:text-2xl'>
          {username}
        </Box>
        <Box component='h2' className='md:text-2xl'>
          {elo}
        </Box>
      </Box>
    </Box>
  );
}
