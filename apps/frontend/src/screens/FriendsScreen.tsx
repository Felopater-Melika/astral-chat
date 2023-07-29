import React from 'react';
import {
  VStack,
  HStack,
  Text,
  IconButton,
  Divider,
  Spinner,
  Box,
  Icon,
} from 'native-base';
import {
  useGetFriendRequests,
  useUpdateFriendRequest,
} from '../services/friendRequestService';

const FriendRequest = ({
  request,
  updateFriendRequest,
}: {
  request: { id: string; username: string };
  updateFriendRequest: any;
}) => {
  return (
    <HStack space={3} alignItems="center">
      <Text>{request.username}</Text>
      <IconButton
        icon={<Icon name="checkmark-circle-outline" size={24} color="green" />}
        onPress={() =>
          updateFriendRequest.mutate({
            requestId: request.id,
            status: 'ACCEPTED',
          })
        }
      />
      <IconButton
        icon={<Icon name="close-circle-outline" size={24} color="red" />}
        onPress={() =>
          updateFriendRequest.mutate({
            requestId: request.id,
            status: 'REJECTED',
          })
        }
      />
      <IconButton
        icon={<Icon name="trash-bin-outline" size={24} color="gray" />}
        onPress={() =>
          updateFriendRequest.mutate({
            requestId: request.id,
            status: 'DELETED',
          })
        }
      />
    </HStack>
  );
};

const FriendsScreen = () => {
  const {
    data: friendRequests,
    isLoading,
    isError,
  } = useGetFriendRequests(userId);
  const updateFriendRequest = useUpdateFriendRequest();

  if (isLoading) {
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
    <VStack space={4} p={4}>
      <Text>Your Friend Requests</Text>
      {friendRequests.map((request: any) => (
        <FriendRequest
          key={request.id}
          request={request}
          updateFriendRequest={updateFriendRequest}
        />
      ))}
      <Divider my={4} />
      <Text>Your Friends</Text>
      {/* Display friends here */}
    </VStack>
  );
};

export default FriendsScreen;
