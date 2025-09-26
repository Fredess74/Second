import { nanoid } from 'nanoid/non-secure';
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore';

import { db } from './firebase';
import { Squad } from '@/types/models';

export const squadsCollection = collection(db, 'squads');

export const generateSquadInviteLink = (squadId: string) => `fetchapp://squad/join/${squadId}`;

export const createSquad = async (squadName: string, ownerId: string) => {
  const squadId = nanoid(8);
  const squadRef = doc(squadsCollection, squadId);
  const squad: Squad = {
    squadId,
    squadName,
    members: [ownerId],
    mascotStatus: 'happy',
    sharedGoal: {
      targetPoints: 25000,
      currentPoints: 0
    },
    shoppingList: []
  };

  await setDoc(squadRef, squad);
  await updateDoc(doc(db, 'users', ownerId), { squadId });

  return squad;
};

export const listenToSquad = (squadId: string, callback: (squad: Squad | null) => void) =>
  onSnapshot(doc(squadsCollection, squadId), snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.data() as Squad);
    } else {
      callback(null);
    }
  });

export const joinSquad = async (squadId: string, userId: string) => {
  const squadRef = doc(squadsCollection, squadId);
  const squadSnap = await getDoc(squadRef);
  if (!squadSnap.exists()) {
    throw new Error('Squad not found');
  }

  const squad = squadSnap.data() as Squad;
  if (squad.members.includes(userId)) {
    return squad;
  }

  await updateDoc(squadRef, {
    members: arrayUnion(userId)
  });

  await updateDoc(doc(db, 'users', userId), { squadId });
  return (await getDoc(squadRef)).data() as Squad;
};

export const addShoppingListItem = async (squadId: string, itemName: string, addedBy: string) => {
  const squadRef = doc(squadsCollection, squadId);
  const itemId = nanoid();
  await updateDoc(squadRef, {
    shoppingList: arrayUnion({
      id: itemId,
      itemName,
      addedBy,
      createdAt: Timestamp.now().toDate().toISOString()
    })
  });
};

export const updateSharedGoal = async (squadId: string, targetPoints: number) => {
  await updateDoc(doc(squadsCollection, squadId), {
    'sharedGoal.targetPoints': targetPoints
  });
};

export const distributeReceiptPoints = async (squadId: string, totalPoints: number) => {
  const squadSnap = await getDoc(doc(squadsCollection, squadId));
  if (!squadSnap.exists()) {
    throw new Error('Squad not found');
  }
  const squad = squadSnap.data() as Squad;
  const perMember = Math.floor(totalPoints / squad.members.length);

  const batchUpdates = squad.members.map(memberId =>
    updateDoc(doc(db, 'users', memberId), {
      totalPoints: increment(perMember),
      weeklyLeaguePoints: increment(perMember)
    })
  );

  await Promise.all(batchUpdates);
  await updateDoc(doc(squadsCollection, squadId), {
    'sharedGoal.currentPoints': increment(totalPoints),
    mascotStatus: totalPoints > 400 ? 'excited' : 'happy'
  });
};
