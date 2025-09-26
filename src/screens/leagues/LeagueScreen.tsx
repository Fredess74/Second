import { useMemo } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { useLeague } from '@/hooks/useLeague';

const LeagueScreen = () => {
  const { profile } = useAuth();
  const { leaderboard, loading, refresh, rewards, seasonCountdown } = useLeague();

  const promotionCutoff = useMemo(() => Math.min(10, leaderboard.length), [leaderboard.length]);

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <Text className="text-3xl font-bold text-gray-900">{profile?.league ?? 'Bronze'} League</Text>
      <Text className="text-gray-600 mt-1">Season ends in {seasonCountdown} • Weekly reset every Monday</Text>

      <View className="mt-5 bg-white rounded-3xl p-5 shadow-sm shadow-black/5">
        <Text className="text-xl font-semibold text-gray-900">This Week&apos;s Leaderboard</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Top {promotionCutoff} advance to the next league. Everyone keeps their hard-earned tier.
        </Text>

        <View className="mt-4 space-y-3">
          {leaderboard.map((member, index) => {
            const isCurrentUser = member.uid === profile?.uid;
            const promoted = index < promotionCutoff;
            return (
              <View
                key={member.uid}
                className={`flex-row items-center justify-between rounded-2xl px-4 py-3 ${
                  promoted ? 'bg-primary/10 border border-primary/40' : 'bg-gray-50'
                }`}
              >
                <View>
                  <Text className={`text-base font-semibold ${isCurrentUser ? 'text-secondary' : 'text-gray-900'}`}>
                    {index + 1}. {isCurrentUser ? 'You' : member.displayName ?? 'Fetcher'}
                  </Text>
                  <Text className="text-xs text-gray-500">{member.pointsThisWeek} pts • Streak x{member.streakMultiplier.toFixed(1)}</Text>
                </View>
                {promoted && <Text className="text-sm font-semibold text-primary">Promoted!</Text>}
              </View>
            );
          })}
          {!leaderboard.length && <Text className="text-gray-500">No leaderboard data yet. Scan a receipt to get started!</Text>}
        </View>
      </View>

      <View className="mt-6 bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold text-gray-900">Weekly Rewards</Text>
        <Text className="text-sm text-gray-600 mt-2">Top players earn a promotion bonus.</Text>
        <View className="flex-row justify-between mt-4">
          <View className="bg-primary/10 rounded-2xl px-4 py-3 flex-1 mr-2">
            <Text className="text-xs text-primary font-semibold">Placement Bonus</Text>
            <Text className="text-xl font-bold text-primary mt-1">+{rewards.placementBonus} pts</Text>
          </View>
          <View className="bg-secondary/10 rounded-2xl px-4 py-3 flex-1">
            <Text className="text-xs text-secondary font-semibold">Streak Bonus</Text>
            <Text className="text-xl font-bold text-secondary mt-1">+{rewards.streakMultiplierBonus} pts</Text>
          </View>
        </View>
      </View>

      <View className="mt-6 bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold text-gray-900">How Leagues Work</Text>
        <Text className="text-sm text-gray-600 mt-2">
          Every Monday you&apos;re grouped with 30-50 players at your tier. Earn weekly points to climb the board.
        </Text>
        <Text className="text-sm text-gray-600 mt-2">
          Scan on at least 5 of 7 days to receive a 1.5x streak multiplier on your weekly points.
        </Text>
        <Text className="text-sm text-gray-600 mt-2">
          Finish in the top 10 to earn a promotion badge and bonus points. No demotions in this MVP.
        </Text>
      </View>
    </ScrollView>
  );
};

export default LeagueScreen;
