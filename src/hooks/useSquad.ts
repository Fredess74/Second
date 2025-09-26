import { useEffect, useState } from 'react';

import { useAuth } from './useAuth';
import { Squad } from '@/types/models';
import {
  addShoppingListItem,
  createSquad,
  distributeReceiptPoints,
  generateSquadInviteLink,
  joinSquad,
  listenToSquad,
  updateSharedGoal
} from '@/services/squadService';

export const useSquad = () => {
  const { user, profile } = useAuth();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.squadId) {
      setSquad(null);
      setLoading(false);
      return;
    }

    const unsubscribe = listenToSquad(profile.squadId, data => {
      setSquad(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [profile?.squadId]);

  const createNewSquad = async (squadName: string) => {
    if (!user) throw new Error('Must be signed in');
    const newSquad = await createSquad(squadName, user.uid);
    setSquad(newSquad);
    return newSquad;
  };

  const joinExistingSquad = async (squadId: string) => {
    if (!user) throw new Error('Must be signed in');
    const updatedSquad = await joinSquad(squadId, user.uid);
    setSquad(updatedSquad);
    return updatedSquad;
  };

  const shareReceiptWithSquad = async (totalPoints: number) => {
    if (!squad) throw new Error('You need a squad to share points');
    await distributeReceiptPoints(squad.squadId, totalPoints);
  };

  const addItemToShoppingList = async (itemName: string) => {
    if (!squad || !user) throw new Error('You need a squad to add items');
    await addShoppingListItem(squad.squadId, itemName, user.uid);
  };

  const setSharedGoalTarget = async (target: number) => {
    if (!squad) throw new Error('You need a squad to update goals');
    await updateSharedGoal(squad.squadId, target);
  };

  const inviteLink = squad ? generateSquadInviteLink(squad.squadId) : null;

  return {
    squad,
    loading,
    createNewSquad,
    joinExistingSquad,
    shareReceiptWithSquad,
    inviteLink,
    addItemToShoppingList,
    setSharedGoalTarget
  };
};
