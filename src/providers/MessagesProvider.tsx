import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { ChatMessage, ConversationInfo, Pagination, Props } from '@/types.ts';
import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';
import { toast } from 'react-toastify';
import ConversationService from '@/services/ConversationService.ts';
import { useAsync } from 'react-use';
import { useUserInformationContext } from '@/providers/UserInformationProvider.tsx';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';
import { useStompClientContext } from '@/providers/StompClientProvider.tsx';

interface MessagesContext {
  conversations?: ConversationInfo[];
  setConversations?: Dispatch<SetStateAction<ConversationInfo[]>>;
  numberOfUnseen?: number;
}

export const MessagesContext = createContext<MessagesContext>({} as MessagesContext);

export const useMessagesContext = () => {
  return useContext(MessagesContext);
};

export default function MessagesProvider({ children }: Props) {
  const { authToken } = useAuthenticationContext();
  const { isConnected } = useStompClientContext();
  const { username } = useUserInformationContext();
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);

  const fetchConversations = async () => {
    if (!username) return;

    try {
      let { items } = (await ConversationService.listConversations(authToken)) as Pagination<ConversationInfo>;

      items = items
        .map((item) => ({ ...item, peers: item.peers.filter((o) => o !== username) }) as ConversationInfo)
        .sort((a, b) => {
          if (a.lastMessage && b.lastMessage) {
            return Date.parse(b.lastMessage.timeStamp!) - Date.parse(a.lastMessage.timeStamp!);
          } else if (a.lastMessage && !b.lastMessage) {
            return -1;
          } else if (!a.lastMessage && b.lastMessage) {
            return 1;
          } else {
            return b.cid - a.cid;
          }
        });

      setConversations(items);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useAsync(async () => {
    if (!authToken) {
      setConversations([]);
    } else {
      await fetchConversations();
    }
  }, [authToken, username, isConnected]);

  const onMessages = (messages: ChatMessage) => {
    setConversations((pre) => {
      const target = pre.find((o) => o.cid === messages.conversation);

      const currentTarget = window.location.href.match(/\/messages\/(\d+)/)?.[1];

      const isCurrentTarget = currentTarget === target?.cid.toString();

      if (target) {
        return pre.map((o) =>
          o.cid !== messages.conversation
            ? o
            : { ...o, lastMessage: messages, numberOfUnseen: isCurrentTarget ? 0 : o.numberOfUnseen + 1 },
        ) as ConversationInfo[];
      } else {
        return [
          { cid: messages.conversation, lastMessage: messages, numberOfUnseen: 1, peers: [messages.sender] },
          ...pre,
        ] as ConversationInfo[];
      }
    });
  };

  useEffect(() => {
    eventEmitter.on(EventName.ReloadConversation, fetchConversations);
    eventEmitter.on(EventName.OnTopicMessages, onMessages);

    return () => {
      eventEmitter.off(EventName.ReloadConversation);
      eventEmitter.off(EventName.OnTopicMessages);
    };
  }, [authToken, username]);

  const numberOfUnseen = conversations.reduce((acc, o) => acc + o.numberOfUnseen, 0);

  return (
    <MessagesContext.Provider value={{ conversations, numberOfUnseen, setConversations }}>
      {children}
    </MessagesContext.Provider>
  );
}
