import React, { useContext, useState } from 'react';
import {
  Box,
  Text,
  Avatar,
  Center,
  HStack,
  Spinner,
  Heading,
  Button,
  Modal,
  VStack,
  FormControl,
  Input,
  Toast,
} from 'native-base';
import { useUserProfile } from '../services/userService';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../app/AppContext';
import { useNavigation } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../app/App';
import { removeToken } from '../utils/storage';
import { Controller, useForm } from 'react-hook-form';
import { IUser } from '../../../../libs/types';

function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);
  const { profileQuery, deleteProfileMutation, updateProfileMutation } =
    useUserProfile();
  const { data: profile, isLoading } = profileQuery;
  const { setIsSignedIn } = useContext(AppContext);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IUser>();

  const handleLogout = async () => {
    await removeToken();
    setIsSignedIn(false);
    navigation.getParent()?.navigate('Login');
  };

  const handleDeleteAccount = async () => {
    await deleteProfileMutation.mutateAsync();
    await removeToken();
    setIsSignedIn(false);
    navigation.getParent()?.navigate('Login');
  };

  const onSubmit = (data: IUser) => {
    if (!data.firstName) {
      data.firstName = profile.firstName;
    }
    if (!data.lastName) {
      data.lastName = profile.lastName;
    }

    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        Toast.show({
          title: 'Profile Update Successful',
          duration: 4000,
          placement: 'bottom',
        });
        setShowModal(false);
      },
      onError: (error: any) => {
        Toast.show({
          title: 'Profile Update Error',
          description: error.message,
          duration: 4000,
          placement: 'bottom',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <HStack space={2} justifyContent="center">
        <Spinner color="indigo" />
        <Heading color="indigo" fontSize="md">
          Loading
        </Heading>
      </HStack>
    );
  }

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <Center mt={20} width="100%" height="100%">
      <Avatar size="2xl" bg="indigo.500">
        {initials}
      </Avatar>
      <Center width="100%" flex={1} alignItems="left" ml="9">
        <Text my="3">ID: {profile.id}</Text>
        <Text my="3">Username: {profile.username}</Text>
        <Text my="3">
          Name: {profile.firstName} {profile.lastName}
        </Text>
        <Text my="3">Email: {profile.email}</Text>
        <Text my="3" fontSize="md">
          Verified:{' '}
          {profile.emailVerified ? (
            <AntDesign name="checkcircle" size={16} color="green" />
          ) : (
            <AntDesign name="close" />
          )}
        </Text>
        <Box my="3">
          <Button mb="3" width={100} onPress={handleLogout}>
            Log out
          </Button>
          <Button mb="3" width={120} onPress={() => setShowModal(true)}>
            Update Profile
          </Button>
          <Button
            mb="3"
            width={120}
            onPress={handleDeleteAccount}
            isLoading={deleteProfileMutation.isLoading}
          >
            Delete Account
          </Button>
        </Box>
      </Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Update Profile</Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              <FormControl isInvalid={'firstName' in errors}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="First Name"
                    />
                  )}
                  name="firstName"
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
                    />
                  )}
                  name="lastName"
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
                    />
                  )}
                  name="username"
                />
                <FormControl.ErrorMessage>
                  {errors.username?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
              <Button onPress={() => setShowModal(false)}>Cancel</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}

export default ProfileScreen;
