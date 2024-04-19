import { Box } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useEffect, useState } from 'react';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FriendResponseCard from '@/pages/Dashboard/FriendsBox/FriendResponseCard.tsx';
import FriendCard from '@/pages/Dashboard/FriendsBox/FriendCard.tsx';
import FriendRequestCard from '@/pages/Dashboard/FriendsBox/FriendRequestCard.tsx';
import { FriendsMessageType, Props, PublicInformation } from '@/types.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { toast } from 'react-toastify';
import UserService from '@/services/UserService.ts';
import TextField from '@/components/custom/TextField.tsx';

enum FriendsMode {
  View,
  Add,
  Delete,
}

export default function FriendsBox() {
  const [mode, setMode] = useState(FriendsMode.View);
  const [query, setQuery] = useState('');

  const switchMode = (mode: FriendsMode) => {
    setMode(mode);
  };

  return (
    <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
      <Box className='flex flex-col gap-4 p-4'>
        <Box className='flex gap-2'>
          <TextField value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search username....' />
          <Box
            component='button'
            onClick={() => switchMode(mode === FriendsMode.Add ? FriendsMode.View : FriendsMode.Add)}
            className={`border-[1px] rounded px-2 border-black shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]  ${mode === FriendsMode.Add ? 'border-black' : ''}`}>
            {mode === FriendsMode.Add ? <CloseOutlinedIcon /> : <AddOutlinedIcon />}
          </Box>
        </Box>
        <Box className='flex-auto overflow-auto'>
          <Box className='h-full flex flex-col gap-2'>
            <FriendDispatcher mode={mode} query={query} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface FriendDispatcherProps extends Props {
  mode: FriendsMode;
  query: string;
}

function FriendDispatcher({ mode, query }: FriendDispatcherProps) {
  const { stompClient } = useStompClientContext();
  const { username, friends = [], requests = [] } = useUserInformationContext();
  const [searchUsers, setSearchUsers] = useState<PublicInformation[]>([]);
  const [onInvite, setOnInvite] = useState(false);

  useEffect(() => {
    if (mode !== FriendsMode.Add) return;

    const delay = setTimeout(async () => {
      try {
        const usersData = (await UserService.getPublicInfos(query)) as PublicInformation[];
        setSearchUsers(
          usersData.filter(
            ({ username: userData }) =>
              userData !== username && !friends.includes(userData!) && !requests.includes(userData),
          ),
        );
      } catch (_) {}
    }, 500);

    return () => {
      clearTimeout(delay);
      setSearchUsers([]);
    };
  }, [query, mode]);

  const doInvite = async (friend: string) => {
    if (onInvite || !stompClient || !stompClient.connected) return;

    stompClient.send(
      `/user/${friend}/topic/friends`,
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteRequest,
        username,
      }),
    );

    toast(
      <Box className='flex items-center gap-4 text-black'>
        <Box>
          <LocalFireDepartmentIcon />
        </Box>
        <Box>Your request is sent!</Box>
      </Box>,
    );
  };

  useEffect(() => {
    if (!onInvite) return;
    setTimeout(() => setOnInvite(false), 5000);
  }, [onInvite]);

  switch (mode) {
    case FriendsMode.Add:
      return (
        <Box className='flex flex-col gap-2'>
          {searchUsers.map(({ username, elo }) => (
            <FriendRequestCard key={username} username={username} elo={elo} />
          ))}
        </Box>
      );
    case FriendsMode.View:
      return (
        <Box className='flex flex-col gap-4'>
          <Box>
            <Box className='flex justify-between text-sm mb-2 border-t-2 border-black font-bold'>
              <Box>Requests</Box>
              <Box>{requests.length}</Box>
            </Box>
            <Box className='flex flex-col gap-2'>
              {requests.map((sender) => (
                <FriendResponseCard key={sender} sender={sender} />
              ))}
            </Box>
          </Box>
          <Box>
            <Box className='flex justify-between text-sm mb-2 border-t-2 border-black font-bold'>
              <Box>Friends</Box>
              <Box>{friends.length}</Box>
            </Box>
            <Box className='flex flex-col gap-2'>
              {friends
                .filter((friend) => friend.includes(query))
                .map((friend) => (
                  <FriendCard
                    key={friend}
                    friend={friend}
                    action={() => doInvite(friend)}
                    actionIcon={<LocalFireDepartmentIcon fontSize='small' />}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      );
    case FriendsMode.Delete:
      return <></>;
  }
}
