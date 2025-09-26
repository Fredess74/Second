import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import AuthNavigator from './stacks/AuthNavigator';
import MainNavigator from './stacks/MainNavigator';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#FF8F3F" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="Main" component={MainNavigator} /> : <Stack.Screen name="Auth" component={AuthNavigator} />}
    </Stack.Navigator>
  );
};

export default RootNavigator;
