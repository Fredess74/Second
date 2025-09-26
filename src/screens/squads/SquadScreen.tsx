import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Mascot from '@/components/Mascot';
import { useAuth } from '@/hooks/useAuth';
import { useSquad } from '@/hooks/useSquad';

const SquadScreen = () => {
  const { profile } = useAuth();
  const { squad, loading, createNewSquad, joinExistingSquad, inviteLink, addItemToShoppingList, setSharedGoalTarget } = useSquad();
  const [squadName, setSquadName] = useState('');
  const [joinId, setJoinId] = useState('');
  const [itemName, setItemName] = useState('');
  const [updatingGoal, setUpdatingGoal] = useState(false);

  const members = squad?.members ?? [];

  const handleCreate = async () => {
    if (!squadName.trim()) return;
    try {
      await createNewSquad(squadName.trim());
      setSquadName('');
    } catch (error) {
      Alert.alert('Unable to create squad', (error as Error)?.message ?? 'Please try again.');
    }
  };

  const handleJoin = async () => {
    if (!joinId.trim()) return;
    try {
      await joinExistingSquad(joinId.trim());
      setJoinId('');
    } catch (error) {
      Alert.alert('Unable to join squad', (error as Error)?.message ?? 'Check the invite ID and try again.');
    }
  };

  const handleCopyInvite = () => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      Alert.alert('Invite link copied', 'Share it with your friends to squad up!');
    }
  };

  const handleAddItem = async () => {
    if (!itemName.trim()) return;
    try {
      await addItemToShoppingList(itemName.trim());
      setItemName('');
    } catch (error) {
      Alert.alert('Unable to add item', (error as Error)?.message ?? 'Please try again.');
    }
  };

  const handleUpdateGoal = async (target: number) => {
    try {
      setUpdatingGoal(true);
      await setSharedGoalTarget(target);
    } catch (error) {
      Alert.alert('Unable to update goal', (error as Error)?.message ?? 'Please try again later.');
    } finally {
      setUpdatingGoal(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-600">Loading your squad...</Text>
      </View>
    );
  }

  if (!squad) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }} className="bg-background flex-1">
        <Text className="text-3xl font-bold text-gray-900">Build your Squad</Text>
        <Text className="text-gray-600 mt-2">
          Create a new squad or join an existing one to start splitting points, setting goals, and completing weekly quests.
        </Text>

        <View className="mt-6 bg-white rounded-3xl p-5 shadow-sm shadow-black/5">
          <Text className="text-xl font-semibold text-gray-900">Create Squad</Text>
          <TextInput
            placeholder="Name your squad"
            value={squadName}
            onChangeText={setSquadName}
            className="mt-3 bg-gray-100 rounded-xl px-4 py-3"
          />
          <TouchableOpacity onPress={handleCreate} className="mt-4 bg-primary rounded-xl py-3 items-center">
            <Text className="text-white font-semibold">Create</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 bg-white rounded-3xl p-5 shadow-sm shadow-black/5">
          <Text className="text-xl font-semibold text-gray-900">Join Squad</Text>
          <TextInput
            placeholder="Enter invite ID"
            value={joinId}
            onChangeText={setJoinId}
            className="mt-3 bg-gray-100 rounded-xl px-4 py-3"
          />
          <TouchableOpacity onPress={handleJoin} className="mt-4 bg-secondary rounded-xl py-3 items-center">
            <Text className="text-white font-semibold">Join</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="bg-background flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 160 }}>
      <Text className="text-3xl font-bold text-gray-900">{squad.squadName}</Text>
      <Text className="text-gray-600 mt-1">Invite friends with the link below and start earning faster.</Text>

      <View className="mt-5 bg-white rounded-3xl p-5 shadow-sm shadow-black/5">
        <View className="items-center">
          <Mascot status={squad.mascotStatus} />
        </View>
        <TouchableOpacity onPress={handleCopyInvite} className="mt-6 bg-secondary/10 rounded-xl px-4 py-3">
          <Text className="text-secondary font-semibold text-center">Copy invite link</Text>
          <Text className="text-xs text-gray-500 text-center mt-1">{inviteLink}</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold text-gray-900">Members</Text>
        <FlatList
          data={members}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Text className="mt-2 text-gray-700">{item === profile?.uid ? `${item} (you)` : item}</Text>
          )}
        />
      </View>

      <View className="mt-6 bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold text-gray-900">Shared Goal</Text>
        <Text className="text-sm text-gray-600 mt-1">Current: {squad.sharedGoal.targetPoints.toLocaleString()} pts</Text>
        <View className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-accent"
            style={{ width: `${Math.min(100, (squad.sharedGoal.currentPoints / squad.sharedGoal.targetPoints) * 100)}%` }}
          />
        </View>
        <View className="flex-row flex-wrap mt-4 gap-2">
          {[10000, 25000, 50000].map(goal => (
            <TouchableOpacity
              key={goal}
              onPress={() => handleUpdateGoal(goal)}
              className={`px-4 py-2 rounded-full border ${
                squad.sharedGoal.targetPoints === goal ? 'bg-accent text-white border-accent' : 'border-gray-200'
              }`}
            >
              <Text className={`${squad.sharedGoal.targetPoints === goal ? 'text-white' : 'text-gray-700'}`}>{goal.toLocaleString()} pts</Text>
            </TouchableOpacity>
          ))}
        </View>
        {updatingGoal && <Text className="text-xs text-gray-500 mt-2">Updating goal...</Text>}
      </View>

      <View className="mt-6 bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold text-gray-900">Squad Shopping List</Text>
        <View className="flex-row items-center mt-3">
          <TextInput
            placeholder="Add grocery item"
            value={itemName}
            onChangeText={setItemName}
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3"
          />
          <TouchableOpacity onPress={handleAddItem} className="ml-3 bg-primary rounded-xl px-4 py-3">
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-4 space-y-2">
          {squad.shoppingList.map(entry => (
            <View key={entry.id} className="flex-row justify-between bg-gray-50 rounded-xl px-4 py-3">
              <Text className="text-gray-800">{entry.itemName}</Text>
              <Text className="text-xs text-gray-500">by {entry.addedBy}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold text-gray-900">Weekly Challenges</Text>
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800">Quest</Text>
          <Text className="text-sm text-gray-600 mt-1">Scan 5 receipts together this week.</Text>
          <Text className="text-sm text-gray-500 mt-1">Progress updates automatically after each scan.</Text>
        </View>
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800">Squad Duel</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Challenge a teammate and see who collects more points before Sunday night.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SquadScreen;
