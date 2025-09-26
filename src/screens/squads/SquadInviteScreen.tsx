import { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useSquad } from '@/hooks/useSquad';
import { SquadStackParamList } from '@/types/navigation';

const SquadInviteScreen = ({ route, navigation }: NativeStackScreenProps<SquadStackParamList, 'SquadInvite'>) => {
  const { joinExistingSquad } = useSquad();
  const { squadId } = route.params;

  useEffect(() => {
    const join = async () => {
      try {
        await joinExistingSquad(squadId);
        navigation.replace('Squad');
      } catch (error) {
        Alert.alert('Unable to join squad', (error as Error)?.message ?? 'Please try again.');
        navigation.goBack();
      }
    };

    join();
  }, [joinExistingSquad, navigation, squadId]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-gray-700">Joining squad...</Text>
    </View>
  );
};

export default SquadInviteScreen;
