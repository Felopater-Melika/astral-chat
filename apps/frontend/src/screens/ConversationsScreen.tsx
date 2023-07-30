import {
  VStack,
  Text,
  Box,
  Spinner,
  Pressable,
  IconButton,
  Input,
} from 'native-base';
import {
  useGetConversations,
  useDeleteConversation,
} from '../services/conversationService';
import { ChatStackParamList } from '../app/App';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/storage';
import jwtDecode from 'jwt-decode';
import { MaterialIcons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<
  ChatStackParamList,
  'Conversations'
>;

interface JwtDecoded {
  iat: string;
  sub: string;
  username: string;
}
function ConversationScreen() {
  const [userId, setUserId] = useState<string>('');
  const { data: conversations, isLoading, isError } = useGetConversations();
  const deleteConversation = useDeleteConversation();
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');

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

  const filteredConversations = conversations?.filter((conversation: any) =>
    conversation.participants.some(
      (participant: any) =>
        participant.userId !== userId &&
        participant.user.username.toLowerCase().includes(search.toLowerCase())
    )
  );

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
        <Text>Error loading conversations</Text>
      </Box>
    );
  }

  return (
    <VStack space={2} mt={10} flex={1} p={2}>
      <Input
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
        mb={4}
      />
      {filteredConversations.map((conversation: any) => {
        const otherParticipant = conversation.participants.find(
          (participant: any) => participant.userId !== userId
        );
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];

        return (
          <Box
            key={conversation.id}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            my={4}
            py={2}
            px={4}
            bg="gray.900"
            borderRadius="md"
            mb={2}
          >
            <Pressable
              onPress={() =>
                navigation.navigate('Chat', {
                  conversationId: conversation.id,
                  recipientName: otherParticipant.user.username,
                })
              }
            >
              <Text color="white" fontSize="lg">
                {otherParticipant.user.username}
              </Text>
              <Text color="gray.500" fontSize="sm">
                {lastMessage?.body}
              </Text>
            </Pressable>
            <IconButton
              icon={<MaterialIcons name="delete" size={24} color="gray" />}
              onPress={() => {
                deleteConversation.mutate(conversation.id);
              }}
            />
          </Box>
        );
      })}
    </VStack>
  );
}

export default ConversationScreen;
