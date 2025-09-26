import { View, Text } from 'react-native';

import { Challenge } from '@/types/models';

interface WeeklyChallengeCardProps {
  challenge: Challenge;
}

const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({ challenge }) => {
  const progressPercentage = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-black/5">
      <Text className="text-lg font-semibold text-gray-900">{challenge.title}</Text>
      <Text className="text-sm text-gray-600 mt-1">{challenge.description}</Text>
      <View className="mt-3">
        <View className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <View className="h-full bg-primary" style={{ width: `${progressPercentage}%` }} />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          {challenge.progress} / {challenge.target}
        </Text>
      </View>
    </View>
  );
};

export default WeeklyChallengeCard;
