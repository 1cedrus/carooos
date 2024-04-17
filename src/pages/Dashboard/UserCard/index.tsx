import { Badge, Box, Grow, IconButton, useMediaQuery } from '@mui/material';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import UserIcon from '@/components/icons/UserIcon.tsx';
import MessageIcon from '@/components/icons/MessageIcon.tsx';
import FriendsIcon from '@/components/icons/FriendsIcon.tsx';
import LeaveIcon from '@/components/icons/LeaveIcon.tsx';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

enum Tab {
  User = 'user',
  Friends = 'friends',
  Messages = 'messages',
}

const TAB_LIST = [
  { tab: Tab.User, icon: <UserIcon /> },
  { tab: Tab.Messages, icon: <MessageIcon /> },
  { tab: Tab.Friends, icon: <FriendsIcon /> },
];

export default function UserCard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { conversations } = useUserInformationContext();
  const { doLogout } = useAuthenticationContext();
  const largeScreen = useMediaQuery('(min-width:640px)');

  const unSeenMessages = conversations?.reduce((o, current) => {
    if (!current.seen) return o + 1;
    return o;
  }, 0);

  const currentTab = pathname.split('/').pop();

  useEffect(() => {
    if (currentTab === 'dashboard') {
      navigate(Tab.User);
    }
  }, [pathname]);

  return (
    <Box className='flex gap-2 flex-col lg:flex-row w-full lg:w-fit'>
      <Box className='flex lg:flex-col justify-around items-center gap-2 p-2 border-2 border-black rounded-2xl h-fit shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
        {TAB_LIST.map(({ tab, icon }) => (
          <IconButton
            key={tab}
            onClick={() => navigate(tab)}
            className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
            size={largeScreen ? 'medium' : 'small'}
            sx={{ color: 'black', border: `1px ${currentTab === tab ? 'solid' : 'dashed'} black` }}>
            {tab === Tab.Messages && unSeenMessages != 0 ? (
              <Badge badgeContent={unSeenMessages} color={'primary'}>
                {icon}
              </Badge>
            ) : (
              icon
            )}
          </IconButton>
        ))}
        <IconButton
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          onClick={doLogout}
          size={largeScreen ? 'medium' : 'small'}
          sx={{ border: `1px dashed black` }}>
          <LeaveIcon />
        </IconButton>
      </Box>
      <Grow in={true}>
        <Box className='flex flex-col gap-8 min-h-[20rem] lg:h-[30rem] w-full lg:w-[25rem] p-4 border-black border-2 rounded-xl shadow-[0px_-5px_0px_0px_rgba(17,18,38,0.20)_inset]'>
          <Outlet />
        </Box>
      </Grow>
    </Box>
  );
}
