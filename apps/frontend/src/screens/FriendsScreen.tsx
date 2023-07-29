import React, { useEffect, useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  IconButton,
  Divider,
  Spinner,
  Box,
  Center,
  Heading,
  Button,
  Input,
} from 'native-base';
import {
  useDeleteFriendRequest,
  useGetFriendRequests,
  useSendFriendRequest,
  useUpdateFriendRequest,
} from '../services/friendRequestService';
import { getToken } from '../utils/storage';
import jwtDecode from 'jwt-decode';
import { MaterialIcons } from '@expo/vector-icons';

interface JwtDecoded {
  iat: string;
  sub: string;
  username: string;
}
const FriendRequest = ({
  request,
  updateFriendRequest,
  deleteFriendRequest,
  userId,
}: {
  request: { id: string; status: string; username: string; senderId: string };
  updateFriendRequest: any;
  deleteFriendRequest: any;
  userId: string;
}) => {
  return (
    <Center
      bg="primary.200"
      rounded="lg"
      w={'100%'}
      px={2}
      my={2}
      shadow={1}
      _light={{ backgroundColor: 'gray.200' }}
      _dark={{ backgroundColor: 'gray.900' }}
    >
      <HStack
        space={5}
        w={'100%'}
        alignItems="center"
        justifyContent={'space-evenly'}
      >
        <Text>{request.id.slice(0, 8)}...</Text>
        <Text>{request.status.toLowerCase()}</Text>
        {request.senderId !== userId && (
          <>
            <IconButton
              icon={
                <MaterialIcons name="check-circle" size={24} color="green" />
              }
              onPress={() =>
                updateFriendRequest.mutate({
                  requestId: request.id,
                  updateFriendRequest: {
                    status: 'ACCEPTED',
                  },
                })
              }
            />
            <IconButton
              icon={<MaterialIcons name="cancel" size={24} color="red" />}
              onPress={() =>
                updateFriendRequest.mutate({
                  requestId: request.id,
                  updateFriendRequest: {
                    status: 'REJECTED',
                  },
                })
              }
            />
          </>
        )}
        <IconButton
          icon={<MaterialIcons name="delete" size={24} color="gray" />}
          onPress={() =>
            deleteFriendRequest.mutate({
              requestId: request.id,
            })
          }
        />
      </HStack>
    </Center>
  );
};

const FriendsScreen = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<string>('');
  const sendFriendRequest = useSendFriendRequest(userId);

  const handleSendFriendRequest = () => {
    sendFriendRequest.mutate({ senderId: userId, recipientUsername: username });
    setUsername('');
  };
  const {
    data: friendRequests,
    isLoading,
    isError,
  } = useGetFriendRequests(userId);

  console.log(friendRequests);
  const updateFriendRequest = useUpdateFriendRequest(userId);
  const deleteFriendRequest = useDeleteFriendRequest(userId);

  useEffect(() => {
    const fetchTokenAndDecode = async () => {
      const token = await getToken();
      if (!token) {
        return;
      }
      const decoded: JwtDecoded = jwtDecode(token);
      setUserId(decoded.sub);
    };

    fetchTokenAndDecode();
  }, []);

  if (isLoading || !userId) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Error loading friend requests</Text>
      </Box>
    );
  }

  return (
    <VStack h={'100%'} w={'100%'} mt={5} space={4} p={4}>
      <Heading size="md" alignSelf="flex-start">
        Send Friend Request
      </Heading>
      <HStack space={2} w={'100%'}>
        <Input
          w="80%"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Button onPress={handleSendFriendRequest} w={'20%'}>
          Send
        </Button>
      </HStack>
      <Heading size="md" alignSelf="flex-start">
        Your Friend Requests
      </Heading>
      {friendRequests.map((request: any) => (
        <FriendRequest
          key={request.id}
          request={request}
          updateFriendRequest={updateFriendRequest}
          deleteFriendRequest={deleteFriendRequest}
          userId={userId}
        />
      ))}
      <Divider my={4} />
      <Heading size="md" alignSelf="flex-start">
        Your Friends
      </Heading>
    </VStack>
  );
};

export default FriendsScreen;
