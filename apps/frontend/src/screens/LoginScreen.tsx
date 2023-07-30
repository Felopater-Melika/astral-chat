import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  VStack,
  Button,
  Input,
  FormControl,
  Text,
  Box,
  Link,
} from 'native-base';
import { useAuth } from '../services/authService';
import { ILogin } from '../../../../libs/types';
import { useNavigation } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../app/App';
import { AppContext } from '../app/AppContext';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>(); // Updated to AuthStackParamList
  const { setIsSignedIn, isSignedIn } = useContext(AppContext);

  const { loginMutation } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit = (data: ILogin) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setIsSignedIn(true);
      },
      onError: (error: any) => {
        console.log('Login Error', error.message);
      },
    });
  };

  return (
    <VStack
      colorScheme={'indigo'}
      mx={'auto'}
      my={'auto'}
      maxWidth={'200px'}
      space={3}
    >
      <FormControl isInvalid={'username' in errors}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              testID="loginUsernameInput"
            />
          )}
          name="username"
          rules={{ required: 'Username is required' }}
          defaultValue=""
        />
        <FormControl.ErrorMessage>
          {errors.username?.message}
        </FormControl.ErrorMessage>
      </FormControl>
      <FormControl isInvalid={'password' in errors}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              type="password"
              testID="loginPasswordInput"
            />
          )}
          name="password"
          rules={{ required: 'Password is required' }}
          defaultValue=""
        />
        <FormControl.ErrorMessage>
          {errors.password?.message}
        </FormControl.ErrorMessage>
      </FormControl>
      <Button onPress={handleSubmit(onSubmit)}>Login</Button>
      <Box>
        <Text>
          Don't have an account?
          <Link
            _text={{ color: 'indigo.500' }}
            onPress={() => navigation.navigate('Register')}
          >
            Register
          </Link>
        </Text>
      </Box>
    </VStack>
  );
};

export default LoginScreen;
