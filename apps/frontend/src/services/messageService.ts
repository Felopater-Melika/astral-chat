import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getToken } from '../utils/storage';
import Constants from 'expo-constants';

const apiUrl = Constants?.manifest?.extra?.API_URL;

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
  const [socket, setSocket] = useState<any>('ws://10.0.2.2:3000');

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

  const sendChatMessage = useCallback(
    (body: any) => {
      if (socket) {
        console.log('Emitting sendMessage event with body:', body);
        socket.emit('sendMessage', {
          body,
          senderId: userId,
          conversationId,
        });
      }
    },
    [socket, userId, conversationId]
  );

  useEffect(() => {
    const fetchTokenAndDecode = async () => {
      const token = await getToken();
      if (!token) {
        return;
      }

      if (conversationId) {
        const newSocket = io(`ws://192.168.0.82:3000`, {
          query: {
            authorization: `bearer ${token}`,
          },
        });

        setSocket(newSocket);

        newSocket.on('newMessage', (newMessage) => {
          console.log('Received newMessage event with message:', newMessage);
          if (newMessage.conversationId === conversationId) {
            queryClient.setQueryData(
              ['messages', conversationId],
              (old: any) => [...old, newMessage]
            );
            console.log(
              'Updated query data:',
              queryClient.getQueryData(['messages', conversationId])
            ); // add this line
          }
        });

        return () => newSocket.close();
      }
    };

    fetchTokenAndDecode();
  }, [conversationId, queryClient]);

  return { messages, isLoading, isError, sendChatMessage };
};
