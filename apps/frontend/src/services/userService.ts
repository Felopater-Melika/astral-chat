import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getToken } from '../utils/storage';
import Constants from 'expo-constants';
import { IUser } from '../../../../libs/types';

const apiUrl = Constants?.expoConfig?.extra?.API_URL;
const getProfile = async () => {
  const token = await getToken();
  const { data } = await axios.get(apiUrl + '/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const updateProfile = async (profileData: IUser) => {
  const token = await getToken();
  const { data } = await axios.put(apiUrl + '/user/profile', profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const deleteProfile = async () => {
  const token = await getToken();
  const { data } = await axios.delete(apiUrl + '/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export function useUserProfile() {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => profileQuery.refetch(),
  });

  const deleteProfileMutation = useMutation({ mutationFn: deleteProfile });

  return { profileQuery, updateProfileMutation, deleteProfileMutation };
}
