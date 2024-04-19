import { Box, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ErrorPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const forward = () => {
    navigate('/play');
  };

  return (
    <>
      <Collapse in={show} orientation='vertical' timeout={2000}>
        <Box className='h-screen w-full flex items-center justify-center gap-10'>
          <Box
            component='button'
            onClick={forward}
            className='p-4 py-0 bg-white border-8 border-black rounded-t-[10rem] rounded-l-[10rem] text-[200px] hover:text-[220px] transition-all cursor-pointer'>
            <Box
              component='h1'
              className='text-white font-bold'
              sx={{
                textShadow:
                  '10px 10px black, -10px -10px black, -10px -5px black, 5px 5px black, -5px 5px black, 5px -5px black',
              }}>
              Opps-404!
            </Box>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
