import { useState } from 'react';
import { PublicInformation } from '@/types.ts';
import { useAsync } from 'react-use';
import { toast } from 'react-toastify';
import UserService from '@/services/UserService.ts';
import { Avatar, Box } from '@mui/material';
import { IMAGE_URL } from '@/utils/api.ts';

export default function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState<PublicInformation[]>();

  useAsync(async () => {
    try {
      const response = await UserService.getLeaderBoard();

      setLeaderBoard(response);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, []);

  return (
    <Box className='h-[40rem] w-[45rem] border-2 border-black rounded-2xl shadow-custom bg-white p-4 overflow-auto'>
      {leaderBoard?.map(({ username, elo, profilePicUrl }) => (
        <Box key={username} className='flex gap-2 p-2 border-2 border-black shadow-custom rounded-xl items-center'>
          <Avatar src={`${IMAGE_URL}/${profilePicUrl}`}></Avatar>
          <Box className='font-bold'>{username}:</Box>
          <Box>{elo}</Box>
        </Box>
      ))}
    </Box>
  );
}
