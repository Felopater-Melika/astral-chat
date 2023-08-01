import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { getToken } from '../utils/storage';

const apiUrl = Constants?.manifest?.extra?.API_URL;

const createConversation = async (participants: string[]) => {
  const response = await axios.post(
    `${apiUrl}/conversation`,
    {
      participants,
    },
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );
  return response.data;
};

const getConversations = async () => {
  const token = await getToken();
  const response = await axios.get(`${apiUrl}/conversation`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getConversation = async (id: string) => {
  const token = await getToken();
  const response = await axios.get(`${apiUrl}/conversation/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteConversation = async (id: string) => {
  const token = await getToken();
  const response = await axios.delete(`${apiUrl}/conversation/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation(createConversation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    },
  });
};

export const useGetConversations = () => {
  return useQuery(['conversations'], getConversations, {
    refetchInterval: 10000,
  });
};

export const useGetConversation = (id: string) => {
  return useQuery(['conversation', id], () => getConversation(id));
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteConversation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    },
  });
};
