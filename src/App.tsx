import { RouterProvider } from 'react-router-dom';
import router from '@/router.tsx';
import AuthenticationProvider from '@/providers/AuthenticationProvider.tsx';
import StompClientProvider from '@/providers/StompClientProvider.tsx';
import UserInformationProvider from '@/providers/UserInformationProvider.tsx';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme.ts';
import { globalStyles } from '@/styles';
import Snackbar from '@/components/custom/Snackbar.tsx';

export default function App() {
  return (
    <AuthenticationProvider>
      <StompClientProvider>
        <UserInformationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={globalStyles} />
            <RouterProvider router={router} />
            <Snackbar />
          </ThemeProvider>
        </UserInformationProvider>
      </StompClientProvider>
    </AuthenticationProvider>
  );
}
