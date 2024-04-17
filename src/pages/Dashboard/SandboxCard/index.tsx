import { Box, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/custom/Button.tsx';

export default function SandboxCard() {
  const navigate = useNavigate();

  const goSandbox = () => {
    navigate('/sandbox');
  };

  return (
    <Grow in={true}>
      <Box className='lg:h-1/2 p-4 flex flex-col w-full lg:w-[25rem] border-black border-2 rounded-xl shadow-[0px_-5px_0px_0px_rgba(17,18,38,0.20)_inset] justify-center items-center'>
        <Box component='h2' className='hidden lg:block'>
          <pre>
            {' '}
            {`
if you wanna test new strategy
or view last match, go here!
              |
              v
          `}
          </pre>
        </Box>
        <Button
          onClick={goSandbox}
          textClassName='text-xl font-semibold'
          className='rounded-xl shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'>
          Sandbox
        </Button>
      </Box>
    </Grow>
  );
}
