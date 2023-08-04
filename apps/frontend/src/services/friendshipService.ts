import axios from 'axios';
import { getToken } from '../utils/storage';
import Constants from 'expo-constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const apiUrl = Constants?.expoConfig?.extra?.API_URL;

const getFriendships = async () => {
  const token = await getToken();
  const response = await axios.get(`${apiUrl}/friendship`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteFriendship = async (id: string) => {
  const token = await getToken();
  const response = await axios.delete(`${apiUrl}/friendship/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useGetFriendships = () => {
  return useQuery(['friendships'], getFriendships, {
    refetchInterval: 10000,
  });
};

export const useDeleteFriendship = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteFriendship, {
    onSuccess: () => {
      queryClient.invalidateQueries(['friendships']);
    },
  });
};
