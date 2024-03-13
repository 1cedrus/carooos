import { Box, Grow, IconButton } from '@mui/material';
import GamepadOutlinedIcon from '@mui/icons-material/GamepadOutlined';

export default function SandboxCard() {
  return (
    <Grow in={true}>
      <Box className='flex flex-col flex-auto lg:w-[25rem] border-black border-2 rounded justify-center items-center gap-4'>
        <Box component='h2' className='text-2xl'>
          Sandbox mode!
        </Box>
        <IconButton sx={{ color: 'black', border: '2px solid black' }} size='large'>
          <GamepadOutlinedIcon fontSize='large' />
        </IconButton>
      </Box>
    </Grow>
  );
}
