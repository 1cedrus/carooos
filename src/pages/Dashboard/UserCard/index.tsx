import { Box, Grow, IconButton, useMediaQuery } from '@mui/material';
import FriendsBox from '@/pages/Dashboard/UserCard/FriendsBox';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { useState } from 'react';
import MessagesBox from '@/pages/Dashboard/UserCard/MessagesBox';
import { GroupOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import UserBox from '@/pages/Dashboard/UserCard/UserBox.tsx';

enum Tab {
  User,
  Friends,
  Messages,
}

const TAB_LIST = [
  { tab: Tab.User, icon: <PersonOutlineOutlined /> },
  { tab: Tab.Messages, icon: <MessageOutlinedIcon /> },
  { tab: Tab.Friends, icon: <GroupOutlined /> },
];

export default function UserCard() {
  const { doLogout } = useAuthenticationContext();
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.User);
  const largeScreen = useMediaQuery('(min-width:640px)');

  return (
    <Box className='flex gap-2'>
      <Box className='flex flex-col items-center gap-2 p-2 border-2 border-black rounded-2xl h-fit'>
        {TAB_LIST.map(({ tab, icon }) => (
          <IconButton
            onClick={() => setCurrentTab(tab)}
            size={largeScreen ? 'medium' : 'small'}
            sx={{ color: 'black', border: `2px ${currentTab === tab ? 'solid' : 'dashed'} black` }}>
            {icon}
          </IconButton>
        ))}
        <IconButton
          onClick={doLogout}
          size={largeScreen ? 'medium' : 'small'}
          sx={{ color: 'black', border: `2px dashed black` }}>
          <ExitToAppOutlinedIcon fontSize={largeScreen ? 'medium' : 'small'} />
        </IconButton>
      </Box>
      <Grow in={true}>
        <Box className='flex flex-col gap-8 h-1/2 lg:h-[30rem] w-full lg:w-[25rem] p-4 border-black border-2 rounded'>
          {currentTab === Tab.Friends && <FriendsBox />}
          {currentTab === Tab.Messages && <MessagesBox />}
          {currentTab === Tab.User && <UserBox />}
        </Box>
      </Grow>
    </Box>
  );
}
