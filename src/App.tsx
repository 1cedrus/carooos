import { RouterProvider } from 'react-router-dom';
import router from '@/router.tsx';
import AuthenticationProvider from '@/providers/AuthenticationProvider.tsx';
import StompClientProvider from '@/providers/StompClientProvider.tsx';
import UserInformationProvider from '@/providers/UserInformationProvider.tsx';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme.ts';
import { globalStyles } from '@/styles';
import { ToastContainer } from 'react-toastify';
import GameProvider from '@/providers/GameProvider.tsx';
import SandboxProvider from '@/providers/SandboxProvider.tsx';
import MessagesProvider from '@/providers/MessagesProvider.tsx';
import FriendsProvider from '@/providers/FriendsProvider.tsx';
import QueueProvider from '@/providers/QueueProvider.tsx';

export default function App() {
  return (
    <AuthenticationProvider>
      <UserInformationProvider>
        <StompClientProvider>
          <QueueProvider>
            <MessagesProvider>
              <FriendsProvider>
                <SandboxProvider>
                  <GameProvider>
                    <ThemeProvider theme={theme}>
                      <CssBaseline />
                      <GlobalStyles styles={globalStyles} />
                      <RouterProvider router={router} />
                      <ToastContainer
                        toastClassName='border-2 border-black'
                        position='top-right'
                        autoClose={3000}
                        newestOnTop
                        closeOnClick
                      />
                    </ThemeProvider>
                  </GameProvider>
                </SandboxProvider>
              </FriendsProvider>
            </MessagesProvider>
          </QueueProvider>
        </StompClientProvider>
      </UserInformationProvider>
    </AuthenticationProvider>
  );
}
