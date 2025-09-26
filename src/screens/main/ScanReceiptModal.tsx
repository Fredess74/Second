import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useSquad } from '@/hooks/useSquad';
import { HomeStackParamList } from '@/types/navigation';

const generatePoints = () => Math.floor(Math.random() * 400) + 100;

const ScanReceiptModal = () => {
  const navigation = useNavigation<NativeStackScreenProps<HomeStackParamList>['navigation']>();
  const { squad, shareReceiptWithSquad } = useSquad();
  const [isScanning, setIsScanning] = useState(false);
  const [points, setPoints] = useState<number | null>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setPoints(generatePoints());
      setIsScanning(false);
    }, 1200);
  };

  const handleShare = async () => {
    if (!squad || !points) return;
    try {
      await shareReceiptWithSquad(points);
      Alert.alert('Success', `Shared ${points} points with your squad!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', (error as Error)?.message ?? 'Failed to share points.');
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-900">Scan Receipt</Text>
      <Text className="text-gray-600 mt-1">Use this simulator to award points and share them with your squad.</Text>

      <View className="mt-6 bg-gray-100 rounded-3xl h-72 items-center justify-center border border-dashed border-gray-300">
        <Text className="text-gray-500 text-lg">Camera simulation</Text>
        <TouchableOpacity onPress={handleSimulateScan} className="mt-4 bg-secondary px-6 py-3 rounded-full">
          <Text className="text-white font-semibold">{isScanning ? 'Scanning...' : 'Tap to Scan'}</Text>
        </TouchableOpacity>
      </View>

      {points && (
        <View className="mt-6 bg-primary/10 border border-primary/40 rounded-2xl p-4">
          <Text className="text-primary font-semibold text-lg">Receipt Points Awarded</Text>
          <Text className="text-2xl font-bold text-primary mt-2">{points} pts</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Share them with your squad to split evenly across all members.
          </Text>

          <TouchableOpacity
            onPress={handleShare}
            disabled={!squad}
            className={`mt-4 rounded-xl py-3 items-center ${squad ? 'bg-primary' : 'bg-gray-400'}`}
          >
            <Text className="text-white font-semibold">Share with Squad</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ScanReceiptModal;
