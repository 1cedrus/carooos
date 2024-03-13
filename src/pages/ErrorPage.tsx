import { Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box className='flex flex-col h-screen justify-center items-center'>
      <Box>yOu JuSt Be DrOpeD Into A wRoNg URL!!</Box>
      <Link onClick={() => navigate('/')}>pUsh yOur Hand herr to Get back!</Link>
    </Box>
  );
}
