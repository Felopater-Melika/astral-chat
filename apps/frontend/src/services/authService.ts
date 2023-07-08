import axios from 'axios';
import { ILogin, IRegister } from '../../../../libs/types';
import { removeToken, storeToken } from '../utils/storage';
import { useMutation } from '@tanstack/react-query';

const loginUser = async (credentials: ILogin) => {
  const { data } = await axios.post(
    'http://10.0.2.2:3000' + '/api/auth/login',
    credentials
  );
  await storeToken(data.access_token);
  return data;
};

const registerUser = async (credentials: IRegister) => {
  const url = process.env.BASE_URL + '/api/auth/register';
  console.log(url);
  console.log(credentials);
  const { data } = await axios.post(url, credentials);
  console.log(data);

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
