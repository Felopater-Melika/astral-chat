import Logout from '../components/Logout';
import { VStack } from 'native-base';

const HomeScreen = () => {
  return (
    <VStack testID="homeScreen">
      <Logout />
    </VStack>
  );
};

export default HomeScreen;
