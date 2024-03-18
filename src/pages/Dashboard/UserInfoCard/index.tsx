import { Avatar, Box, Grow, IconButton, useMediaQuery } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import FriendsBox from '@/pages/Dashboard/UserInfoCard/FriendsBox';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

export default function UserInfoCard() {
  const { doLogout } = useAuthenticationContext();
  const { username, elo } = useUserInformationContext();
  const largeScreen = useMediaQuery('(min-width:640px)');

  return (
    <Grow in={true}>
      <Box className='flex flex-col gap-8 h-1/2 lg:h-[30rem] w-full lg:w-[25rem] p-4 border-black border-2 rounded'>
        <Box className='flex-initial flex gap-4 items-center justify-between'>
          <Avatar
            sx={{ width: largeScreen ? 60 : 40, height: largeScreen ? 60 : 40, border: '2px solid black' }}></Avatar>
          <Box className='flex w-full flex-col'>
            <Box component='h2' className='font-bold md:text-2xl'>
              {username}
            </Box>
            <Box component='h2' className='font-bold md:text-2xl'>
              {elo}
            </Box>
          </Box>
          <IconButton
            onClick={doLogout}
            size={largeScreen ? 'medium' : 'small'}
            sx={{ color: 'black', border: '2px solid black' }}>
            <ExitToAppOutlinedIcon fontSize={largeScreen ? 'medium' : 'small'} />
          </IconButton>
        </Box>
        <FriendsBox />
      </Box>
    </Grow>
  );
}
