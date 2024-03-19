import { Props } from '@/types.ts';
import { Box } from '@mui/material';

interface MessageProps extends Props {
  msg: string;
}

export default function Message({ msg, className }: MessageProps) {
  return <Box className={`${className} border-2 p-2 rounded-t-2xl `}>{msg}</Box>;
}
