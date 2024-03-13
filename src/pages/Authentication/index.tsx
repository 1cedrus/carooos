import SignIn from '@/pages/Authentication/SignIn.tsx';
import SignUp from '@/pages/Authentication/SignUp.tsx';
import { Box } from '@mui/material';

export default function Authentication() {
  return (
    <Box>
      <SignUp />
      <SignIn />
    </Box>
  );
}
