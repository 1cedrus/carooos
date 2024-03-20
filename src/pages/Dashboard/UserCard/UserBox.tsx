import { Avatar, Box, Divider, useMediaQuery } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';

export default function UserBox() {
  const { username, elo, friends, requests } = useUserInformationContext();
  const largeScreen = useMediaQuery('(min-width:640px)');

  return (
    <Box className='flex flex-col items-center justify-around gap-8 p-4'>
      <Avatar
        sx={{ width: largeScreen ? 120 : 60, height: largeScreen ? 120 : 60, border: '2px solid black' }}></Avatar>
      <Box className='w-full'>
        <strong>Information</strong>
        <Divider />
        <Box className='flex justify-between gap-10'>
          <Box>
            <Box component='h2' className=''>
              userz: <strong>{username}</strong>
            </Box>
            <Box component='h2' className=''>
              elo: <strong>{elo}</strong>
            </Box>
          </Box>
          <Box>
            <Box>
              friends_num: <strong>{friends?.length}</strong>
            </Box>
            <Box>
              requests_num: <strong>{requests?.length}</strong>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
