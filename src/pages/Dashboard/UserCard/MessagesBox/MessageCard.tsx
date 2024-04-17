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
        className={`p-2 flex justify-between items-center cursor-pointer border-[1px] rounded pl-2 ${!seen ? `border-black border-2 shadow` : ''}`}>
        <Box className='flex justify-between w-[10rem]'>
          <Box component='h2'>{username}</Box>
        </Box>
        {lastMessage && (
          <>
            <Box>{lastMessage.content}</Box>
            <Box className='text-sm text-gray-500'>{fromNow(Date.parse(lastMessage.timeStamp!))}</Box>
          </>
        )}
      </Box>
    </Grow>
  );
}
