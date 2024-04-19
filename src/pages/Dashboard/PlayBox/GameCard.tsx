import { Box } from '@mui/material';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';
import Button from '@/components/custom/Button.tsx';

export default function GameCard() {
  const { doQueue, quitQueue, onQueue, stompClient } = useStompClientContext();

  return (
    <Box className='flex-auto flex flex-col border-black border-[1px] gap-4 justify-between items-center p-4 rounded-xl shadow-[0px_-5px_0px_0px_rgba(17,18,38,0.20)_inset]'>
      <Box className='flex-auto  w-full p-2'>
        <pre>
          {`       ___                                                  
      / __|   __ _      _ _    ___     ___     ___     ___  
     | (__   / _\` |    | '_|  / _ \\   / _ \\   / _ \\   (_-<  
      \\___|  \\__,_|   _|_|_   \\___/   \\___/   \\___/   /__/_ 
    _|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|
    "\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'
    
    Welcome everybody to the Carooos, this is a game that 
    you can play with your friends, or strangers. It's online
    game so you can play with anyone in the world. Let's play!!
    
    1. Click on the Play button to start matching the game.
    2. Waiting for the opponent to join the game. 
       You can do anything else while waiting. 
    3. When the opponent is found, accept and game will start.
    4. Enjoy the game and have fun.
    
    Game still in heavy development term. Anything can happen.
    If you found a bug, you welcome to create a issue on 
    our github repo. Thanks a lot for playing the game.
`}
        </pre>
      </Box>
      <Box className='flex gap-2 justify-between w-full'>
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
        <Button
          onClick={quitQueue}
          fullWidth
          textClassName='text-xl font-semibold'
          className='rounded-xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
          Leaderboard
        </Button>
      </Box>
    </Box>
  );
}
