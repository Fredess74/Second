import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';

const ProfileScreen = () => {
  const { profile, logout } = useAuth();

  return (
    <LinearGradient colors={['#F7F7FF', '#EAF8FF']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="bg-white rounded-3xl p-6 shadow-sm shadow-black/10">
          <Text className="text-3xl font-bold text-gray-900">{profile?.displayName ?? 'Fetcher'}</Text>
          <Text className="text-gray-500 mt-1">{profile?.email}</Text>

          <View className="mt-6 space-y-4">
            <View className="bg-primary/10 rounded-2xl p-4">
              <Text className="text-primary font-semibold text-sm">Lifetime Points</Text>
              <Text className="text-2xl font-bold text-primary mt-1">{profile?.totalPoints ?? 0}</Text>
            </View>
            <View className="bg-secondary/10 rounded-2xl p-4">
              <Text className="text-secondary font-semibold text-sm">League</Text>
              <Text className="text-xl font-bold text-secondary mt-1">{profile?.league ?? 'Bronze'}</Text>
              <Text className="text-sm text-gray-600 mt-1">Weekly points: {profile?.weeklyLeaguePoints ?? 0}</Text>
            </View>
            <View className="bg-accent/10 rounded-2xl p-4">
              <Text className="text-accent font-semibold text-sm">Scan Streak</Text>
              <Text className="text-xl font-bold text-accent mt-1">{profile?.scanStreak.days ?? 0} days</Text>
            </View>
          </View>

          <TouchableOpacity onPress={logout} className="mt-8 bg-gray-900 rounded-2xl py-3 items-center">
            <Text className="text-white font-semibold">Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
