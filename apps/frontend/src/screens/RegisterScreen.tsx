import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  VStack,
  Button,
  Input,
  FormControl,
  Modal,
  Text,
  Link,
  Box,
} from 'native-base';
import { useAuth } from '../services/authService';
import { IRegister } from '../../../../libs/types';
import { useNavigation } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../app/App';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const { registerMutation } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRegister>();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const onSubmit = (data: IRegister) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setModalTitle('Registration Successful');
        setModalBody(
          'Go check your email to verify your account and then come back login'
        );
        setShowModal(true);
      },
      onError: (error: any) => {
        setModalTitle('Registration Error');
        setModalBody(error.message);
        setShowModal(true);
      },
    });
  };
  const handleCloseModal = () => setShowModal(false);

  return (
    <VStack>
      <FormControl isInvalid={'firstName' in errors}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="First Name"
              testID="registerFirstNameInput"
            />
          )}
          name="firstName"
          rules={{ required: 'First Name is required' }}
          defaultValue=""
        />
        <FormControl.ErrorMessage>
          {errors.firstName?.message}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl isInvalid={'lastName' in errors}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Last Name"
              testID="registerLastNameInput"
            />
          )}
          name="lastName"
          rules={{ required: 'Last Name is required' }}
          defaultValue=""
        />
        <FormControl.ErrorMessage>
          {errors.lastName?.message}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl isInvalid={'username' in errors}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              testID="registerUsernameInput"
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

      <FormControl isInvalid={'email' in errors}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              testID="registerEmailInput"
            />
          )}
          name="email"
          rules={{ required: 'Email is required' }}
          defaultValue=""
        />
        <FormControl.ErrorMessage>
          {errors.email?.message}
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
              testID="registerPasswordInput"
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

      <Button onPress={handleSubmit(onSubmit)}>Register</Button>
      <Box>
        <Text>
          Already have an account?{' '}
          <Link
            _text={{ color: 'indigo.500' }}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Link>
        </Text>
      </Box>
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Body>
            <Text testID="registerModalBody">{modalBody}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button onPress={handleCloseModal}>OK</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};

export default RegisterScreen;
