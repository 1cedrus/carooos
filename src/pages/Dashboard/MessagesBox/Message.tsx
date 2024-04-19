import { Props } from '@/types.ts';
import { Box } from '@mui/material';

interface MessageProps extends Props {
  msg: string;
}

export default function Message({ msg, className }: MessageProps) {
  return (
    <Box
      className={`${className} border-[1px] border-black p-2 rounded-t-2xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]`}>
      {msg}
    </Box>
  );
}
