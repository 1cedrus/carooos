import { Props } from '@/types.ts';
import { Box, Tooltip } from '@mui/material';

interface MessageProps extends Props {
  msg: string;
  timeStamp: string;
}

export default function Message({ msg, timeStamp, className }: MessageProps) {
  return (
    <Tooltip title={timeStamp}>
      <Box className={`${className} border-[1px] border-black py-1 px-2 rounded-t-2xl shadow-custom max-w-[50%]`}>
        {msg}
      </Box>
    </Tooltip>
  );
}
