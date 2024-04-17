import { Box, Grow } from '@mui/material';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import { useState } from 'react';
import { FindingMessage, MatchingMessage, OkMessage, QueueMessage, QueueMessageType } from '@/types.ts';
import { useNavigate } from 'react-router-dom';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import useAsync from '@/hooks/useAsync.ts';
import GameService from '@/services/GameService.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import Button from '@/components/custom/Button.tsx';

export default function GameCard() {
  const navigate = useNavigate();
  const { authToken } = useAuthenticationContext();
  const { stompClient } = useStompClientContext();
  const { username, elo } = useUserInformationContext();
  const [currentGame, setCurrentGame] = useState<string>();
  const [onQueue, setOnQueue] = useState(false);
  const [onWaitingConfirmation, setOnWaitingConfirmation] = useState(false);
  const [subId, setSubId] = useState<string>();

  useAsync(async () => {
    const { game } = await GameService.currentGame(authToken);
    setCurrentGame(game);
  }, []);

  const doQueue = () => {
    if (!stompClient) return;

    const stompSub = stompClient?.subscribe('/topic/queue', (message) => {
      const content = JSON.parse(message.body) as QueueMessage;

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

    setSubId(stompSub?.id);
    setOnQueue(true);
  };

  const quitQueue = () => {
    if (!stompClient || !subId) return;

    stompClient?.unsubscribe(subId);
    setSubId('');
    setOnQueue(false);
  };

  const doContinue = () => {
    navigate(`/game/${currentGame}`);
  };

  return (
    <Grow in={true}>
      <Box className='lg:h-1/2 flex lg:flex-col w-full lg:w-[25rem] justify-center lg:gap-5'>
        <Box className='flex flex-col lg:w-[25rem] flex-auto border-black border-2 gap-4 justify-between items-center p-4 rounded-xl shadow-[0px_-5px_0px_0px_rgba(17,18,38,0.20)_inset]'>
          <Box className='flex-auto  w-full p-2'>
            <pre>{`{
  "mode": "casual",
  "description": "20x20, 5 win",
  "online": null
}`}</pre>
          </Box>
          <Box className='flex gap-2 justify-between w-full'>
            {currentGame ? (
              <Button
                onClick={doContinue}
                textClassName='text-xl font-semibold'
                fullWidth
                className='rounded-xl shadow-[0px_-5px_0px_0px_rgba(17,18,38,0.20)_inset]'>
                Continue
              </Button>
            ) : (
              <>
                {onQueue ? (
                  <Button
                    onClick={quitQueue}
                    textClassName='text-xl font-semibold'
                    fullWidth
                    className='rounded-xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={doQueue}
                    textClassName='text-xl font-semibold'
                    fullWidth
                    className='rounded-xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
                    {stompClient?.connected ? 'Play' : '...'}
                  </Button>
                )}
              </>
            )}
            <Button
              onClick={quitQueue}
              fullWidth
              textClassName='text-xl font-semibold'
              className='rounded-xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
              Leaderboard
            </Button>
          </Box>
        </Box>
      </Box>
    </Grow>
  );
}
