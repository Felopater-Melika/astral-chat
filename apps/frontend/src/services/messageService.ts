import { useEffect, useCallback, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getToken } from '../utils/storage';
import Constants from 'expo-constants';
import { AppContext } from '../app/AppContext';

const apiUrl = Constants?.expoConfig?.extra?.API_URL;

const getMessageService = async (conversationId: any) => {
  const response = await axios.get(
    `${apiUrl}/message?conversationId=${conversationId}`,
    {
      headers: {
        Authorization: `bearer ${await getToken()}`,
      },
    }
  );
  return response.data;
};

export const useChat = (conversationId: any, userId: any) => {
  const queryClient = useQueryClient();
  const { socket } = useContext(AppContext);

  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery(
    ['messages', conversationId],
    () => getMessageService(conversationId),
    {
      enabled: !!conversationId,
    }
  );

  useEffect(() => {
    if (socket && conversationId) {
      socket.on('newMessage', (newMessage: any) => {
        if (newMessage.conversationId === conversationId) {
          queryClient.setQueryData(['messages', conversationId], (old: any) => [
            ...old,
            newMessage,
          ]);
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [conversationId, queryClient, socket]);

  const sendChatMessage = useCallback(
    (body: any) => {
      if (socket) {
        socket.emit('sendMessage', {
          body,
          senderId: userId,
          conversationId,
        });
      }
    },
    [socket, userId, conversationId]
  );

  return { messages, isLoading, isError, sendChatMessage };
};
