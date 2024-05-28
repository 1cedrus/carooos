import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '@/types.ts';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { api } from '@/utils/api.ts';
import { topics } from '@/utils/topics.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';
import { toast } from 'react-toastify';

const RUN_AWAY = 'SOMEONE GOT INTO YOUR ACCOUNT, RUN AWAY!!!';

export interface StompClientContext {
  stompClient?: CompatClient;
  isConnected?: boolean;
}

export const StompClientContext = createContext<StompClientContext>({} as StompClientContext);

export const useStompClientContext = () => {
  return useContext(StompClientContext);
};

export default function StompClientProvider({ children }: Props) {
  const { authToken, doLogout } = useAuthenticationContext();
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState<CompatClient>();

  useEffect(() => {
    if (!authToken) return;

    const stompClient = Stomp.client(api.ws);
    stompClient.connect(
      {
        Authorization: `Bearer ${authToken}`,
      },
      () => {},
    );

    stompClient.onConnect = () => {
      stompClient.reconnectDelay = 1000;
      setIsConnected(true);
      setStompClient(stompClient);
    };

    stompClient.onDisconnect = () => {
      setIsConnected(false);
    };

    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
    };

    stompClient.reconnectDelay = 1000;

    return () => {
      stompClient?.disconnect();
    };
  }, [authToken]);

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const onlineTrackingSub = stompClient.subscribe(topics.ONLINE_TRACKING, (message) => {
      triggerEvent(EventName.ReloadFriends);

      if (message.body === `"${RUN_AWAY}"`) {
        toast.error('Someone just sign into your account, try to reconnect later');
        doLogout();
      }
    });
    console.log('Subscribed to /user/topic/online');

    const mesSub = stompClient.subscribe(topics.MESSAGES, (message) => {
      triggerEvent(EventName.OnTopicMessages, JSON.parse(message.body));
      // setTimeout(() => triggerEvent(EventName.ReloadInfo), 1000);
    });
    console.log('Subscribed to /user/topic/messages');

    const friendsSub = stompClient.subscribe(topics.FRIENDS, (message) => {
      console.log(JSON.parse(message.body));
      triggerEvent(EventName.OnTopicFriends, JSON.parse(message.body));
    });
    console.log('Subscribed to /user/topic/friends');

    return () => {
      mesSub.unsubscribe();
      friendsSub.unsubscribe();
      onlineTrackingSub.unsubscribe();
    };
  }, [stompClient]);

  return <StompClientContext.Provider value={{ stompClient, isConnected }}>{children}</StompClientContext.Provider>;
}
