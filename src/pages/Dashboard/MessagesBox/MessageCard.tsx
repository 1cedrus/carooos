import { ConversationInfo, Props } from '@/types.ts';
import { Avatar, Box, Grow } from '@mui/material';
import usePublicInfo from '@/hooks/usePublicInfo.ts';
import { fromNow } from '@/utils/date.ts';
import { useFriendsContext } from '@/providers/FriendsProvider.tsx';
import { StyledBadge } from '@/pages/Dashboard/FriendsBox/FriendCard.tsx';

interface MessageCardProps extends Props {
  onSelect: () => void;
  conversationInfo: ConversationInfo;
}

export default function MessageCard({
  onSelect,
  conversationInfo: { peers, numberOfUnseen, lastMessage },
}: MessageCardProps) {
  const { friends } = useFriendsContext();
  const { username, profilePicUrl } = usePublicInfo(peers[0]);

  const isOnline = friends?.find((o) => o.username === username)?.isOnline;
  const hasUnseen = numberOfUnseen > 0;

  return (
    <Grow in={true}>
      <Box
        onClick={onSelect}
        className={`p-2 flex justify-between items-center cursor-pointer border-[1px] rounded border-black shadow-custom`}>
        <Box className='flex gap-4 items-center overflow-hidden w-full'>
          {isOnline ? (
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
            </StyledBadge>
          ) : (
            <Avatar src={profilePicUrl} sx={{ border: '1px solid black' }} />
          )}
          <Box className='flex flex-col flex-auto overflow-hidden'>
            <Box className={`text-l font-bold`}>{username}</Box>
            {lastMessage ? (
              <Box className={`w-full whitespace-nowrap text-ellipsis overflow-hidden ${hasUnseen && 'font-semibold'}`}>
                {lastMessage.content}
              </Box>
            ) : (
              <Box className='text-gray-500'>
                You guys are friends now! Send a messages to get in touch with each other!
              </Box>
            )}
          </Box>
          {lastMessage && <Box className='text-sm text-gray-500'>{fromNow(Date.parse(lastMessage.timeStamp!))}</Box>}
        </Box>
      </Box>
    </Grow>
  );
}
