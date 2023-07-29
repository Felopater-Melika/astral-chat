import Constants from 'expo-constants';
import {
  QueryFunctionContext,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import {
  ICreateFriendRequest,
  IUpdateFriendRequest,
} from '../../../../libs/types';
import { getToken } from '../utils/storage';

const apiUrl = Constants?.manifest?.extra?.apiUrl;

const sendFriendRequest = async (createFriendRequest: ICreateFriendRequest) => {
  const token = await getToken();
  const response = await axios.post(
    `${apiUrl}/friend-request`,
    createFriendRequest,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const getFriendRequests = async (context: QueryFunctionContext<string[]>) => {
  const userId = context.queryKey[1];
  const token = await getToken();
  console.log(userId, token);
  const response = await axios.get(`${apiUrl}/friend-request/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateFriendRequest = async ({
  requestId,
  updateFriendRequest,
}: {
  requestId: string;
  updateFriendRequest: IUpdateFriendRequest;
}) => {
  const response = await axios.patch(
    `${apiUrl}/friend-request/${requestId}`,
    {
      status: updateFriendRequest.status,
    },
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );
  return response.data;
};

const deleteFriendRequest = async (requestId: string) => {
  const response = await axios.delete(`${apiUrl}/friend-request/${requestId}`);
  return response.data;
};

export const useSendFriendRequest = () => {
  return useMutation(sendFriendRequest);
};

export const useGetFriendRequests = (userId: string) => {
  return useQuery(['friendRequests', userId], getFriendRequests);
};

export const useUpdateFriendRequest = () => {
  return useMutation(updateFriendRequest);
};

export const useDeleteFriendRequest = () => {
  return useMutation(deleteFriendRequest);
};
