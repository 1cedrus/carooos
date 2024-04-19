import { Props } from '@/types.ts';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { Avatar, Box } from '@mui/material';

interface UserProps extends Props {
  username?: string;
}

export default function User({ className, username }: UserProps) {
  const { elo } = usePublicInfo(username!);

  return (
    <Box className={`flex items-center gap-4 ${className}`}>
      <Avatar sx={{ width: 40, height: 40, border: '1px solid black' }}></Avatar>
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
