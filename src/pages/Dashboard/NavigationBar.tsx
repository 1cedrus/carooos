import { Badge, Box, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { MessageIcon, PlayIcon, SandboxIcon, UserIcon, FriendsIcon, LeaveIcon } from '@/components/shared/icons.tsx';

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
  const { conversations, requests } = useUserInformationContext();
  const navigate = useNavigate();
  const currentTab = pathname;

  const unSeenMessages = conversations?.reduce((o, current) => {
    if (!current.seen) return o + 1;
    return o;
  }, 0);

  return (
    <Box className='flex flex-col h-fit justify-around items-center gap-2 p-2 border-2 border-black rounded-2xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
      {TAB_LIST.map(({ tab, icon }) => (
        <IconButton
          key={tab}
          title={tab}
          onClick={() => navigate(tab)}
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          sx={{ color: 'black', border: `1px ${currentTab?.includes(tab) ? 'solid' : 'dashed'} black` }}>
          {tab === TabPath.Messages && unSeenMessages != 0 ? (
            <Badge badgeContent={unSeenMessages} color={'secondary'}>
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
  );
}
