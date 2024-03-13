import { Props } from '@/types.ts';
import useFetch from '@/hooks/useFetch.ts';
import { api } from '@/utils/api.ts';
import { Box, Grow, IconButton } from '@mui/material';
import usePublicInformation from '@/hooks/usePublicInformation.ts';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface FriendResponseCardProps extends Props {
  sender: string;
}

export default function FriendResponseCard({ sender }: FriendResponseCardProps) {
  const fetch = useFetch();
  const { setFriends, setRequests } = useUserInformationContext();
  const { username, elo } = usePublicInformation(sender);

  const doAccept = async () => {
    const response = await fetch(`${api.http}/api/friends/${username}`, {
      method: 'post',
    });

    if (response.status === 202) {
      setFriends((pre) => [...(pre || []), username!]);
      setRequests((pre) => {
        const newState = [...(pre || [])];
        const index = newState.indexOf(username!);
        if (index > -1) {
          newState.splice(index, 1);
        }
        return newState;
      });
    }
  };

  const doRefuse = async () => {
    const response = await fetch(`${api.http}/api/friends/${username}`, {
      method: 'delete',
    });

    if (response.status === 202) {
      setRequests((pre) => {
        const newState = [...(pre || [])];
        const index = newState.indexOf(username!);
        if (index > -1) {
          newState.splice(index, 1);
        }
        return newState;
      });
    }
  };

  return (
    <Grow in={true}>
      <Box className='flex justify-between items-center p-1 pl-2 border-[1px] rounded border-amber-300'>
        <Box component='h2' className='w-[5rem]'>
          {username}
        </Box>
        <Box component='h4' className=''>
          {elo}
        </Box>
        <Box className='flex gap-2 items-center'>
          <IconButton onClick={doAccept} sx={{ color: 'black' }}>
            <CheckOutlinedIcon fontSize='small' />
          </IconButton>
          <IconButton onClick={doRefuse} sx={{ color: 'black' }}>
            <CloseOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Grow>
  );
}
