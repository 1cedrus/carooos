import { ConversationInfo, Props } from '@/types.ts';
import { Box, Grow } from '@mui/material';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { fromNow } from '@/utils/date.ts';

interface MessageCardProps extends Props {
  onSelect: () => void;
  conversationInfo: ConversationInfo;
}

export default function MessageCard({ onSelect, conversationInfo: { peers, seen, lastMessage } }: MessageCardProps) {
  const { username } = usePublicInfo(peers[0]);

  return (
    <Grow in={true}>
      <Box
        onClick={onSelect}
        className={`p-2 flex justify-between items-center cursor-pointer border-[1px] rounded border-black shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset] ${!seen ? `border-black border-2 shadow` : ''}`}>
        <Box className='flex flex-col'>
          <Box className='text-l font-bold'>{username}</Box>
          {lastMessage && <Box>Last message: {lastMessage.content}</Box>}
        </Box>
        {lastMessage && <Box className='text-sm text-gray-500'>{fromNow(Date.parse(lastMessage.timeStamp!))}</Box>}
      </Box>
    </Grow>
  );
}
