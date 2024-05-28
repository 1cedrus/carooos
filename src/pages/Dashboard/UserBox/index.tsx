import { Avatar, Badge, Box, Divider, IconButton, useMediaQuery } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { useAsync } from 'react-use';
import GameService from '@/services/GameService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { useState } from 'react';
import { Game } from '@/types.ts';
import { fromNow } from '@/utils/date.ts';
import SandboxProvider from '@/providers/SandboxProvider.tsx';
import SandBox from '@/pages/Dashboard/SandBox.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import ChangeProfilePicModal from '@/pages/Dashboard/UserBox/ChangeProfilePicModal.tsx';
import { PencilEdit01Icon } from '@/components/shared/icons.tsx';
import ProfileSettingButton from '@/pages/Dashboard/UserBox/ProfileSettingButton.tsx';
import ChangePasswordModal from '@/pages/Dashboard/UserBox/ChangePasswordModal.tsx';
import ChangeEmailModal from '@/pages/Dashboard/UserBox/ChangeEmailModal.tsx';
import { useFriendsContext } from '@/providers/FriendsProvider.tsx';
import UserGameSkeleton from '@/components/skeleton/UserGameSkeleton.tsx';

export default function UserBox() {
  const { authToken } = useAuthenticationContext();
  const { username, elo, profilePicUrl, email } = useUserInformationContext();
  const { friends, requests } = useFriendsContext();
  const largeScreen = useMediaQuery('(min-width:640px)');
  const [games, setGames] = useState<Game[]>();
  const [viewsGame, setViewsGame] = useState<Game>();
  const [total, setTotal] = useState(0);

  useAsync(async () => {
    const { items, total } = await GameService.listHistory(authToken);
    setGames(items);
    setTotal(total);
  }, []);

  if (viewsGame) {
    return (
      <SandboxProvider game={viewsGame}>
        <SandBox onBack={() => setViewsGame(undefined)} />
      </SandboxProvider>
    );
  }

  return (
    <>
      <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-custom bg-white'>
        <Box className='flex flex-col items-center justify-around gap-8 p-8 relative'>
          <ProfileSettingButton />
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                onClick={() => eventEmitter.emit(EventName.OpenChangeProfilePicModal)}
                className='shadow-custom'
                size='small'
                sx={{ color: 'black', border: `1px solid black`, bgcolor: 'white', ':hover': { bgcolor: '#eee' } }}>
                <PencilEdit01Icon />
              </IconButton>
            }>
            <Avatar
              src={profilePicUrl}
              sx={{
                width: largeScreen ? 120 : 60,
                height: largeScreen ? 120 : 60,
                border: '2px solid black',
              }}></Avatar>
          </Badge>
          <Box className='w-full'>
            <strong>Information</strong>
            <Divider />
            <Box className='flex justify-between gap-10'>
              <Box>
                <Box component='h2' className=''>
                  username: <strong>{username}</strong>
                </Box>
                <Box component='h2' className=''>
                  elo: <strong>{elo}</strong>
                </Box>
                <Box component='h2' className=''>
                  email: <strong>{email}</strong>
                </Box>
              </Box>
              <Box>
                <Box>
                  friends_num: <strong>{friends?.length}</strong>
                </Box>
                <Box>
                  requests_num: <strong>{requests?.length}</strong>
                </Box>
                <Box>
                  games_num: <strong>{total}</strong>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className='w-full h-full'>
            <strong>History</strong>
            <Divider />
            <Box className='h-[17rem]'>
              <Box className='h-full overflow-y-auto flex flex-col gap-2 mt-2'>
                {games ? (
                  games.length ? (
                    games.map((game) => (
                      <Box
                        onClick={() => setViewsGame(game)}
                        key={game.id}
                        className='flex justify-between cursor-pointer border-[1px] border-black rounded p-2 shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
                        <Box>
                          <Box className=''>
                            opponent: <strong>{game.roomCode.split('-').find((o) => o !== username)}</strong>
                          </Box>
                          <Box component='h2'>
                            played_at: <strong>{fromNow(Date.parse(game.playedAt))} </strong>
                          </Box>
                        </Box>
                        <Box>
                          <Box component='h2'>
                            first_move: <strong>{game.firstMoveUser} </strong>
                          </Box>
                          <Box component='h2'>
                            winner: <strong>{game.winner || 'none'} </strong>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box className='text-center'>You have not done any match!</Box>
                  )
                ) : (
                  <Box className='flex flex-col gap-2'>
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <UserGameSkeleton key={i} />
                      ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ChangeProfilePicModal />
      <ChangePasswordModal />
      <ChangeEmailModal />
    </>
  );
}
