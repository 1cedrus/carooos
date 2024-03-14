import { Box, IconButton, TextField, Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useEffect, useState } from 'react';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import usePublicInformations from '@/hooks/usePublicInformations.ts';
import FriendResponseCard from '@/pages/Dashboard/UserInforCard/FriendsBox/FriendResponseCard.tsx';
import FriendCard from '@/pages/Dashboard/UserInforCard/FriendsBox/FriendCard.tsx';
import FriendRequestCard from '@/pages/Dashboard/UserInforCard/FriendsBox/FriendRequestCard.tsx';
import { FriendsMessage, FriendsMessageType } from '@/types.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useNavigate } from 'react-router-dom';

export default function FriendsBox() {
  const navigate = useNavigate();
  const { stompClient } = useStompClientContext();
  const { friends, requests, username, setFriends, setRequests } = useUserInformationContext();
  const [friendQuery, setFriendQuery] = useState('');
  const result = usePublicInformations(friendQuery);
  const [onAddFriends, setOnAddFriends] = useState(false);

  const switchMode = () => {
    setOnAddFriends((pre) => !pre);
  };

  const doResponse = async (responseUser: string) => {
    stompClient?.send(
      `/user/${responseUser}/topic/friends`,
      {},
      JSON.stringify({
        type: FriendsMessageType.InviteResponse,
        username: username,
      }),
    );

    navigate(`/game/${responseUser}-${username}`);
  };

  useEffect(() => {
    const sub = stompClient?.subscribe('/user/topic/friends', (message) => {
      const content = JSON.parse(message.body) as FriendsMessage;

      console.log(content);

      switch (content.type) {
        case FriendsMessageType.FriendRequest:
          setRequests((pre) => [content.username, ...(pre || [])]);
          break;
        case FriendsMessageType.FriendResponse:
          setFriends((pre) => [content.username, ...(pre || [])]);
          break;
        case FriendsMessageType.InviteRequest:
          triggerEvent(
            EventName.OpenInforSnackBar,
            `${content.username} want to play with youu!!!`,
            <Button variant='contained' sx={{ color: 'white' }} onClick={() => doResponse(content.username)}>
              Okii
            </Button>,
          );
          break;
        case FriendsMessageType.InviteResponse:
          triggerEvent(EventName.OpenInforSnackBar, `${content.username} accepted your invite!`);
          navigate(`/game/${username}-${content.username}`);
          break;
      }
    });

    return () => {
      sub?.unsubscribe();
    };
  }, [stompClient]);

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
          onClick={switchMode}
          size='small'
          sx={{ color: 'black', border: '1px solid lightgray', borderRadius: '10%' }}>
          {onAddFriends ? <CloseOutlinedIcon /> : <AddOutlinedIcon />}
        </IconButton>
      </Box>
      <Box className='flex-auto overflow-auto'>
        <Box className='h-full flex flex-col gap-2'>
          {onAddFriends ? (
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
              {friends?.map((friend) => <FriendCard key={friend} friend={friend} />)}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
