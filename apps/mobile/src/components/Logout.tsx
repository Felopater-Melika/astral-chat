import { Button } from 'native-base';
import { removeToken } from '../utils/storage';
import { useContext } from 'react';
import { AppContext } from '../app/AppContext';
import { useNavigation } from '@react-navigation/core';
import { StackParamList } from '../app/App';
import { NavigationProp } from '@react-navigation/native';

const Logout = () => {
  const { setIsSignedIn } = useContext(AppContext);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handleLogout = async () => {
    await removeToken();
    setIsSignedIn(false);
    navigation.navigate('Login');
  };

  return <Button onPress={handleLogout}>Log out</Button>;
};

export default Logout;
