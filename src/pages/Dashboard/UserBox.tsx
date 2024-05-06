import { Avatar, Box, Divider, useMediaQuery } from '@mui/material';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import useAsync from '@/hooks/useAsync.ts';
import GameService from '@/services/GameService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { useState } from 'react';
import { Game } from '@/types.ts';
import { fromNow } from '@/utils/date.ts';
import SandboxProvider from '@/providers/SandboxProvider.tsx';
import SandBox from '@/pages/Dashboard/SandBox.tsx';

export default function UserBox() {
  const { authToken } = useAuthenticationContext();
  const { username, elo, friends, requests } = useUserInformationContext();
  const largeScreen = useMediaQuery('(min-width:640px)');
  const [games, setGames] = useState<Game[]>();
  const [viewsGame, setViewsGame] = useState<Game>();

  useAsync(async () => {
    const { items } = await GameService.listHistory(authToken);
    setGames(items);
  }, []);

  if (viewsGame) {
    return (
      <SandboxProvider game={viewsGame}>
        <SandBox onBack={() => setViewsGame(undefined)} />
      </SandboxProvider>
    );
  }

  return (
    <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
      <Box className='flex flex-col items-center justify-around gap-8 p-8'>
        <Avatar
          sx={{ width: largeScreen ? 120 : 60, height: largeScreen ? 120 : 60, border: '2px solid black' }}></Avatar>
        <Box className='w-full'>
          <strong>Information</strong>
          <Divider />
          <Box className='flex justify-between gap-10'>
            <Box>
              <Box component='h2' className=''>
                userz: <strong>{username}</strong>
              </Box>
              <Box component='h2' className=''>
                elo: <strong>{elo}</strong>
              </Box>
            </Box>
            <Box>
              <Box>
                friends_num: <strong>{friends?.length}</strong>
              </Box>
              <Box>
                requests_num: <strong>{requests?.length}</strong>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className='w-full'>
          <strong>History</strong>
          <Divider />
          <Box className='flex flex-col gap-2 mt-2 h-[18rem] overflow-auto'>
            {games?.map((game) => (
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
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}