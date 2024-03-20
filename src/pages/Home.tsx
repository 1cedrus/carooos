import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
  const navigate = useNavigate();

  const forward = () => {
    navigate('/login');
  };

  return (
    <Box className='h-screen w-full bg-xs-os bg-cover flex flex-col items-center justify-center gap-10'>
      <Box className='p-4 py-0 bg-white border-8 border-black rounded-t-[10rem] rounded-l-[10rem]'>
        <Box
          component='h1'
          className='text-white text-[200px] font-bold'
          sx={{
            textShadow:
              '10px 10px black, -10px -10px black, -10px -5px black, 5px 5px black, -5px 5px black, 5px -5px black',
          }}>
          CAROOOS!
        </Box>
      </Box>
      <Box>
        <Box
          component='button'
          onClick={forward}
          className='bg-white text-5xl font-extrabold border-8 border-black p-8 rounded-[50%] hover:p-10'>
          <ArrowForwardIcon sx={{ fontSize: '5rem' }} />
        </Box>
      </Box>
    </Box>
  );
}
