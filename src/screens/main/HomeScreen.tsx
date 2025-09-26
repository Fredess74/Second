import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { useSquad } from '@/hooks/useSquad';
import { HomeStackParamList } from '@/types/navigation';
import WeeklyChallengeCard from '@/components/WeeklyChallengeCard';
import { Challenge } from '@/types/models';

const demoChallenges: Challenge[] = [
  {
    id: 'weekly-quest',
    title: 'Squad Quest: Scan 5 receipts',
    description: 'Team up and scan five receipts together to earn a 1.2x multiplier!',
    progress: 3,
    target: 5
  },
  {
    id: 'duel',
    title: 'Duel of the Week',
    description: 'Challenge a squadmate to beat your points by Sunday night.',
    progress: 1,
    target: 1
  }
];

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackScreenProps<HomeStackParamList>['navigation']>();
  const { profile } = useAuth();
  const { squad } = useSquad();

  const squadProgress = useMemo(() => {
    if (!squad) return 0;
    const { currentPoints, targetPoints } = squad.sharedGoal;
    return Math.min(1, currentPoints / targetPoints);
  }, [squad]);

  return (
    <LinearGradient colors={['#FFE6D5', '#F7F7FF']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View className="bg-white rounded-3xl p-5 shadow-sm shadow-black/10">
          <Text className="text-2xl font-bold text-gray-900">Hey {profile?.displayName ?? 'Fetcher'} 👋</Text>
          <Text className="text-gray-600 mt-1">You have {profile?.totalPoints ?? 0} lifetime points.</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('ScanReceiptModal')}
            className="mt-5 bg-secondary rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">Scan Receipt</Text>
          </TouchableOpacity>

          {squad ? (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800">Squad Goal</Text>
              <View className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                <View className="h-full bg-accent" style={{ width: `${squadProgress * 100}%` }} />
              </View>
              <Text className="mt-2 text-sm text-gray-500">
                {squad.sharedGoal.currentPoints.toLocaleString()} / {squad.sharedGoal.targetPoints.toLocaleString()} points saved
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('SquadTab' as never)}
              className="mt-6 bg-accent/20 border border-dashed border-accent rounded-2xl p-4"
            >
              <Text className="text-accent font-semibold text-center">
                Create or join a squad to start sharing points!
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-3">Weekly Highlights</Text>
          {demoChallenges.map(challenge => (
            <WeeklyChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
