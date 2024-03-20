import { Box, IconButton, TextField } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useEffect, useState } from 'react';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import usePublicInfos from '@/hooks/usePublicInfos.ts';
import FriendResponseCard from '@/pages/Dashboard/UserCard/FriendsBox/FriendResponseCard.tsx';
import FriendCard from '@/pages/Dashboard/UserCard/FriendCard.tsx';
import FriendRequestCard from '@/pages/Dashboard/UserCard/FriendsBox/FriendRequestCard.tsx';
import { FriendsMessage, FriendsMessageType } from '@/types.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useNavigate } from 'react-router-dom';
import { topics } from '@/utils/topics.ts';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { toast } from 'react-toastify';
import GroupIcon from '@mui/icons-material/Group';

enum FriendsMode {
  View,
  Add,
  Delete,
}

export default function FriendsBox() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(FriendsMode.View);
  const { stompClient } = useStompClientContext();
  const { friends, requests, username } = useUserInformationContext();
  const [friendQuery, setFriendQuery] = useState('');
  const result = usePublicInfos(friendQuery);

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

  return (
    <Box className='flex-auto flex flex-col border-black border-2 rounded p-2 gap-4 overflow-auto'>
      <Box className='flex gap-2'>
        <TextField
          value={friendQuery}
          onChange={(e) => setFriendQuery(e.target.value)}
          fullWidth
          size='small'
          placeholder='frend'
          sx={{ borderColor: 'lightgray' }}
        />
        <IconButton
          onClick={() => switchMode(mode === FriendsMode.Add ? FriendsMode.View : FriendsMode.Add)}
          size='small'
          sx={{ color: 'black', border: '1px solid lightgray', borderRadius: '10%' }}>
          {mode === FriendsMode.Add ? <CloseOutlinedIcon /> : <AddOutlinedIcon />}
        </IconButton>
      </Box>
      <Box className='flex-auto overflow-auto'>
        <Box className='h-full flex flex-col gap-2'>
          {mode === FriendsMode.Add ? (
            <>
              {result
                ?.filter(
                  (user) =>
                    !friends?.includes(user.username!) &&
                    !requests?.includes(user.username!) &&
                    user.username !== username,
                )
                .map(({ username, elo }) => <FriendRequestCard key={username} username={username!} elo={elo!} />)}
            </>
          ) : (
            <>
              {requests?.map((sender) => <FriendResponseCard key={sender} sender={sender} />)}
              {friends?.map((friend) => (
                <FriendCard
                  key={friend}
                  friend={friend}
                  action={() => doInvite(friend)}
                  actionIcon={<LocalFireDepartmentIcon fontSize='small' />}
                />
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
