import React, { useContext } from 'react';
import { NativeBaseProvider } from 'native-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import theme from '../../theme';
import darkTheme from '@react-navigation/native/src/theming/DarkTheme';
import HomeScreen from '../screens/HomeScreen';
import { AppContext, AppContextProvider } from './AppContext'; // adjust the import path according to your folder structure

export type StackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const queryClient = new QueryClient();

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

function MainComponent() {
  const { isSignedIn } = useContext(AppContext);

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default App;
