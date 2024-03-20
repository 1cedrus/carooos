import { Box } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useEffect, useState } from 'react';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FriendResponseCard from '@/pages/Dashboard/UserCard/FriendsBox/FriendResponseCard.tsx';
import FriendCard from '@/pages/Dashboard/UserCard/FriendCard.tsx';
import FriendRequestCard from '@/pages/Dashboard/UserCard/FriendsBox/FriendRequestCard.tsx';
import { FriendsMessage, FriendsMessageType, Props, PublicInformation } from '@/types.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useNavigate } from 'react-router-dom';
import { topics } from '@/utils/topics.ts';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { toast } from 'react-toastify';
import GroupIcon from '@mui/icons-material/Group';
import UserService from '@/services/UserService.ts';
import TextField from '@/components/custom/TextField.tsx';

enum FriendsMode {
  View,
  Add,
  Delete,
}

export default function FriendsBox() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(FriendsMode.View);
  const { stompClient } = useStompClientContext();
  const { username } = useUserInformationContext();
  const [query, setQuery] = useState('');

  const switchMode = (mode: FriendsMode) => {
    setMode(mode);
  };

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const sub = stompClient?.subscribe(topics.FRIENDS, (message) => {
      const content = JSON.parse(message.body) as FriendsMessage;

      switch (content.type) {
        case FriendsMessageType.FriendRequest:
          return triggerEvent(EventName.ReloadInfo);
        case FriendsMessageType.FriendResponse:
          return (() => {
            triggerEvent(EventName.ReloadInfo);
            toast(
              <Box className='flex items-center gap-4 text-black'>
                <Box>
                  <GroupIcon />
                </Box>
                <Box>
                  <strong>{content.username}</strong> accepted your friend request!
                </Box>
              </Box>,
            );
          })();
        case FriendsMessageType.InviteRequest:
          return toast(
            <Box className='flex items-center gap-4 text-black'>
              <Box>
                <LocalFireDepartmentIcon />
              </Box>
              <Box>
                <strong>{content.username}</strong> want to play with youu!!! <strong>Tap to accept!</strong>
              </Box>
            </Box>,
            {
              onClick: () => doAccept(content.username),
              hideProgressBar: false,
              autoClose: 5000,
            },
          );

        case FriendsMessageType.InviteResponse:
          return (() => {
            navigate(`/game/${username}-${content.username}`);
            toast(
              <Box className='flex items-center gap-4 text-black'>
                <Box>
                  <LocalFireDepartmentIcon />
                </Box>
                <Box>
                  <strong>{content.username}</strong> accepted your request!
                </Box>
              </Box>,
            );
          })();
      }
    });

    return () => {
      sub?.unsubscribe();
    };
  }, [stompClient]);

  const doAccept = async (responseUser: string) => {
    stompClient?.send(
      topics.USER_FRIENDS(responseUser),
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteResponse,
        username: username,
      }),
    );

    navigate(`/game/${responseUser}-${username}`);
  };

  return (
    <Box className='flex-auto flex flex-col gap-4 overflow-auto'>
      <Box className='flex gap-2'>
        <TextField value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search username....' />
        <Box
          component='button'
          onClick={() => switchMode(mode === FriendsMode.Add ? FriendsMode.View : FriendsMode.Add)}
          className={`border-2 rounded px-2 hover:border-black ${mode === FriendsMode.Add ? 'border-black' : ''}`}>
          {mode === FriendsMode.Add ? <CloseOutlinedIcon /> : <AddOutlinedIcon />}
        </Box>
      </Box>
      <Box className='flex-auto overflow-auto'>
        <Box className='h-full flex flex-col gap-2'>
          <FriendDispatcher mode={mode} query={query} />
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
    };
  }, [query]);

  const doInvite = async (friend: string) => {
    if (!stompClient || !stompClient.connected) return;

    stompClient.send(
      `/user/${friend}/topic/friends`,
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteRequest,
        username,
      }),
    );
  };

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
