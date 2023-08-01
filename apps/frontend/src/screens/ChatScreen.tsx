import React, { useEffect, useState, useRef } from 'react';
import {
  VStack,
  Text,
  Button,
  Box,
  HStack,
  Heading,
  Input,
  ArrowBackIcon,
  KeyboardAvoidingView,
  IconButton,
} from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { useChat } from '../services/messageService';
import { getToken } from '../utils/storage';
import jwtDecode from 'jwt-decode';
import { Platform, ScrollView } from 'react-native';
import { StackParamList } from '../app/App';

type ChatScreenRouteProp = RouteProp<StackParamList, 'Chat'>;

interface ChatScreenProps {
  route: ChatScreenRouteProp;
}

interface JwtDecoded {
  iat: string;
  sub: string;
  username: string;
}

function ChatScreen({ route }: ChatScreenProps) {
  const { conversationId, recipientName } = route.params;
  const [userId, setUserId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const scrollViewRef = useRef(null);

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    scrollViewRef?.current?.scrollToEnd({ animated: false });
  }, []);
  const { messages, isLoading, isError, sendChatMessage } = useChat(
    conversationId,
    userId
  );

  const filteredMessages = messages?.filter(
    (message: any) => message.conversationId === conversationId
  );

  useEffect(() => {
    // Scroll to the bottom of the ScrollView whenever a new message is received
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  }, [filteredMessages]); // Add messages as a dependency

  const handleSendMessage = () => {
    if (message) {
      sendChatMessage(message);
      setMessage('');
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading messages</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <VStack style={{ flex: 1 }} mt={10} justifyContent="space-between">
        <Box>
          <HStack justifyContent="space-between" alignItems="center" p={4}>
            <HStack space={2} alignItems="center">
              <IconButton
                icon={<ArrowBackIcon />}
                onPress={() => navigation.navigate('Tabs')}
              />
              <Heading>{recipientName}</Heading>
            </HStack>
          </HStack>
        </Box>
        <ScrollView ref={scrollViewRef}>
          {filteredMessages.map((message: any, index: any) => (
            <Box
              rounded="lg"
              p={4}
              my={2}
              shadow={1}
              _dark={{ backgroundColor: 'gray.900' }}
              alignSelf={
                message.senderId === userId ? 'flex-end' : 'flex-start'
              }
              key={index}
            >
              <Text>{message.body}</Text>
            </Box>
          ))}
        </ScrollView>
        <HStack space={2} m={2}>
          <Input
            flex={1}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message here..."
          />
          <Button onPress={handleSendMessage}>Send</Button>
        </HStack>
      </VStack>
    </KeyboardAvoidingView>
  );
}

export default ChatScreen;
