import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ILogin, IRegister } from '../../../../libs/types';
import { removeToken, storeToken } from '../utils/storage';
import { useMutation } from '@tanstack/react-query';
import Constants from 'expo-constants';

const apiUrl = Constants?.manifest?.extra?.API_URL;

const loginUser = async (credentials: ILogin) => {
  const { data } = await axios.post(apiUrl + '/auth/login', credentials);
  await storeToken(data.access_token);
  return data;
};

const registerUser = async (credentials: IRegister) => {
  const { data } = await axios.post(apiUrl + '/auth/register', credentials);

  return data;
};

export function useAuth() {
  const loginMutation = useMutation({ mutationFn: loginUser });

  const registerMutation = useMutation({ mutationFn: registerUser });

  const logout = async () => {
    await removeToken();
  };

  return { loginMutation, registerMutation, logout };
}
