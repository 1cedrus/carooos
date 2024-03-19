import { Box, Grow, IconButton } from '@mui/material';
import GamepadOutlinedIcon from '@mui/icons-material/GamepadOutlined';
import { useNavigate } from 'react-router-dom';

export default function SandboxCard() {
  const navigate = useNavigate();

  const goSandbox = () => {
    navigate('/sandbox');
  };

  return (
    <Grow in={true}>
      <Box className='lg:h-1/2 p-4 flex flex-col w-full lg:w-[25rem] border-black border-2 rounded justify-center items-center gap-4'>
        <Box component='h2' className='text-2xl hidden lg:block'>
          Sandbox mode!
        </Box>
        <IconButton onClick={goSandbox} sx={{ color: 'black', border: '2px solid black' }} size='large'>
          <GamepadOutlinedIcon fontSize='large' />
        </IconButton>
      </Box>
    </Grow>
  );
}
