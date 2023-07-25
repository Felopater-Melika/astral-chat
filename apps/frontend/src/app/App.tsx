import React, { useContext } from 'react';
import { NativeBaseProvider } from 'native-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import theme from '../../theme';
import darkTheme from '@react-navigation/native/src/theming/DarkTheme';
import { AppContext, AppContextProvider } from './AppContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import { Ionicons } from '@expo/vector-icons';
import FriendsScreen from '../screens/FriendsScreen'; // adjust the import path according to your folder structure

export type StackParamList = {
  Register: undefined;
  Login: undefined;
  Tabs: undefined;
};

export type BottomTabNavigatorParamList = {
  Profile: undefined;
  Chat: undefined;
  Friends: undefined;
};

export type ChatStackParamList = {
  Conversations: undefined;
  Chat: { conversationId: string };
};

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();

const queryClient = new QueryClient();

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </ChatStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'chatbox' : 'chatbox-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainComponent() {
  const { isSignedIn } = useContext(AppContext);

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <AppContextProvider>
      <NativeBaseProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer theme={darkTheme}>
            <MainComponent />
          </NavigationContainer>
        </QueryClientProvider>
      </NativeBaseProvider>
    </AppContextProvider>
  );
}

export default App;
