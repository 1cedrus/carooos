import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { api } from '@/utils/api.ts';
import { topics } from '@/utils/topics.ts';

export interface StompClientContext {
  stompClient?: CompatClient;
}

export const StompClientContext = createContext<StompClientContext>({} as StompClientContext);

export const useStompClientContext = () => {
  return useContext(StompClientContext);
};

export default function StompClientProvider({ children }: Props) {
  const { isAuthenticated, authToken } = useAuthenticationContext();
  const [stompClient, setStompClient] = useState<CompatClient>();

  useEffect(() => {
    if (!isAuthenticated) return;

    const stompClient = Stomp.client(api.ws);
    stompClient.connect(
      {
        Authorization: `Bearer ${authToken}`,
      },
      () => {
        stompClient.subscribe(topics.MESSAGES, (message) => {
          console.log(message.body);
        });

        console.log('WebSocket established!');
      },
    );

    // Intend to make component re-render in-time
    setTimeout(() => setStompClient(stompClient), 1000);

    return () => {
      stompClient?.disconnect();
    };
  }, [isAuthenticated]);

  return <StompClientContext.Provider value={{ stompClient }}>{children}</StompClientContext.Provider>;
}
