import { Skeleton } from '@mui/lab';
import { Box } from '@mui/material';

export default function UserGameSkeleton() {
  return (
    <Box className='flex justify-between border-[1px] border-black rounded p-2 shadow-custom'>
      <Box>
        <Skeleton variant='text' width={200} />
        <Skeleton variant='text' width={200} />
      </Box>
      <Box>
        <Skeleton variant='text' width={200} />
        <Skeleton variant='text' width={200} />
      </Box>
    </Box>
  );
}
