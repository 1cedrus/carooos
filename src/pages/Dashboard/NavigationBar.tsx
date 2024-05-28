import { Badge, Box, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { MessageIcon, PlayIcon, SandboxIcon, UserIcon, FriendsIcon, LeaveIcon } from '@/components/shared/icons.tsx';
import { useMessagesContext } from '@/providers/MessagesProvider.tsx';
import { useFriendsContext } from '@/providers/FriendsProvider.tsx';
import TimeCounter from '@/pages/Dashboard/TimeCounter.tsx';

enum TabPath {
  User = 'user',
  Friends = 'friends',
  Messages = 'messages',
  Play = 'play',
  Sandbox = 'sandbox',
}

const TAB_LIST = [
  { tab: TabPath.Play, icon: <PlayIcon /> },
  { tab: TabPath.Sandbox, icon: <SandboxIcon /> },
  { tab: TabPath.User, icon: <UserIcon /> },
  { tab: TabPath.Messages, icon: <MessageIcon /> },
  { tab: TabPath.Friends, icon: <FriendsIcon /> },
];

export default function NavigationBar() {
  const { pathname } = useLocation();
  const { doLogout } = useAuthenticationContext();
  const { numberOfUnseen } = useMessagesContext();
  const { requests } = useFriendsContext();
  const navigate = useNavigate();
  const currentTab = pathname;

  return (
    <Box className='flex flex-col gap-2'>
      <Box className='flex flex-col h-fit justify-around items-center gap-2 p-2 border-2 border-black rounded-2xl shadow-custom bg-white'>
        {TAB_LIST.map(({ tab, icon }) => (
          <IconButton
            key={tab}
            title={tab}
            onClick={() => navigate(tab)}
            className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
            sx={{ color: 'black', border: `1px ${currentTab?.includes(tab) ? 'solid' : 'dashed'} black` }}>
            {tab === TabPath.Messages && numberOfUnseen != 0 ? (
              <Badge badgeContent={numberOfUnseen} color={'secondary'}>
                {icon}
              </Badge>
            ) : tab === TabPath.Friends && requests?.length != 0 ? (
              <Badge badgeContent={requests?.length} color={'secondary'}>
                {icon}
              </Badge>
            ) : (
              icon
            )}
          </IconButton>
        ))}
        <IconButton
          title='sign out'
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          onClick={doLogout}
          sx={{ border: `1px dashed black` }}>
          <LeaveIcon />
        </IconButton>
      </Box>
      <TimeCounter />
    </Box>
  );
}
