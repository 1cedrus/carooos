import { Props } from '@/types.ts';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { Avatar, Box, Tooltip } from '@mui/material';

interface UserProps extends Props {
  username?: string;
  hideInfo?: boolean;
}

export default function User({ className, username, hideInfo }: UserProps) {
  const { elo, profilePicUrl } = usePublicInfo(username!);

  return (
    <Box className={`flex items-center gap-4 ${className}`}>
      <Tooltip title={`${username} - ${elo}`}>
        <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }}></Avatar>
      </Tooltip>
      {!hideInfo && (
        <Box className='flex w-full flex-col'>
          <Box component='h2' className='md:text-2xl'>
            {username}
          </Box>
          <Box component='h2' className='md:text-2xl'>
            {elo}
          </Box>
        </Box>
      )}
    </Box>
  );
}
