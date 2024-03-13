import { Box, Grow, IconButton } from '@mui/material';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useState } from 'react';
import { FindingMessage, MatchingMessage, OkMessage, QueueMessage, QueueMessageType } from '@/types.ts';
import { useNavigate } from 'react-router-dom';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import SandboxCard from '@/pages/Dashboard/SandboxCard.tsx';

export default function GameCard() {
  const navigate = useNavigate();
  const { stompClient } = useStompClientContext();
  const { username, elo } = useUserInformationContext();
  const [onQueue, setOnQueue] = useState(false);
  const [onWaitingConfirmation, setOnWaitingConfirmation] = useState(false);

  const doQueue = () => {
    const stompSub = stompClient?.subscribe('/topic/queue', (message) => {
      const content = JSON.parse(message.body) as QueueMessage;

      console.log(content);

      switch (content.type) {
        case QueueMessageType.FINDING:
          const { username: findingUsername, elo: findingElo } = content.data as FindingMessage;

          if (onWaitingConfirmation || username === findingUsername || Math.abs(elo! - findingElo) > 100) return;

          stompClient?.send(
            '/topic/queue',
            {},
            JSON.stringify({
              type: QueueMessageType.MATCHING,
              data: {
                match: `${username}-${findingUsername}`,
              },
            }),
          );

          setOnWaitingConfirmation(true);
          setTimeout(() => setOnWaitingConfirmation(false), 5000);
          break;
        case QueueMessageType.MATCHING:
          const { match } = content.data as MatchingMessage;
          const [userSend, intendToReceived] = match.split('-');

          if (onWaitingConfirmation || username === userSend || username !== intendToReceived) return;

          stompClient?.send(
            '/topic/queue',
            {},
            JSON.stringify({
              type: QueueMessageType.OK,
              data: {
                ok: match,
              },
            }),
          );

          stompSub?.unsubscribe();
          navigate(`/game/${userSend}-${intendToReceived}`);

          break;

        case QueueMessageType.OK:
          const { ok } = content.data as OkMessage;
          const [user1, user2] = ok.split('-');

          if (!onWaitingConfirmation && username !== user1) return;

          stompSub?.unsubscribe();
          navigate(`/game/${user1}-${user2}`);

          break;
      }
    });

    stompClient?.send(
      '/topic/queue',
      {},
      JSON.stringify({
        type: QueueMessageType.FINDING,
        data: {
          username,
          elo,
        },
      }),
    );

    setOnQueue(true);
  };

  return (
    <Grow in={true}>
      <Box className='flex lg:flex-col h-[30rem] w-[25rem] justify-center gap-4 lg:gap-5'>
        <Box className='flex flex-col lg:w-[25rem] flex-auto border-black border-2 rounded justify-center items-center gap-4'>
          {stompClient?.connected ? (
            <>
              <Box component='h2' className='text-2xl'>
                Click to play!
              </Box>
              {onQueue ? (
                <Box>Matching...</Box>
              ) : (
                <IconButton onClick={doQueue} sx={{ color: 'black', border: '2px solid black' }} size='large'>
                  <PlayArrowOutlinedIcon fontSize='large' />
                </IconButton>
              )}
            </>
          ) : (
            <Box component='h2' className='text-2xl'>
              Connecting...
            </Box>
          )}
        </Box>
        <SandboxCard />
      </Box>
    </Grow>
  );
}
