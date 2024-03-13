import { RouterProvider } from 'react-router-dom';
import router from '@/router.tsx';
import AuthenticationProvider from '@/providers/AuthenticationProvider.tsx';
import StompClientProvider from '@/providers/StompClientProvider.tsx';
import UserInformationProvider from '@/providers/UserInformationProvider.tsx';

export default function App() {
  return (
    <AuthenticationProvider>
      <StompClientProvider>
        <UserInformationProvider>
          <RouterProvider router={router} />
        </UserInformationProvider>
      </StompClientProvider>
    </AuthenticationProvider>
  );
}
