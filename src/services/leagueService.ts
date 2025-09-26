import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from './firebase';
import { LeagueGroup, LeagueGroupMember, LeagueTier } from '@/types/models';
import { getWeekRange } from '@/utils/date';
import { hashStringToNumber } from '@/utils/hash';

const leagueTiers: LeagueTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Legend', 'Mythic'];

export const getNextLeague = (current: LeagueTier): LeagueTier => {
  const index = leagueTiers.indexOf(current);
  return leagueTiers[Math.min(index + 1, leagueTiers.length - 1)];
};

export const getLeagueGroupId = (league: LeagueTier, weekKey: string, groupNumber: number) =>
  `${league.toLowerCase()}_${weekKey}_group_${groupNumber}`;

export const getOrCreateLeagueGroup = async (league: LeagueTier, uid: string) => {
  const { key, weekStart, weekEnd } = getWeekRange();
  const groupNumber = hashStringToNumber(uid + key + league, 5) + 1;
  const targetGroupId = getLeagueGroupId(league, key, groupNumber);

  const groupRef = doc(db, 'leagues', targetGroupId);
  const groupSnapshot = await getDoc(groupRef);
  if (!groupSnapshot.exists()) {
    const newGroup: LeagueGroup = {
      leagueId: targetGroupId,
      leagueName: league,
      members: [],
      weekStartDate: weekStart.toISOString(),
      weekEndDate: weekEnd.toISOString(),
      weekKey: key
    };
    await setDoc(groupRef, newGroup);
  }

  const groupData = (await getDoc(groupRef)).data() as LeagueGroup;
  const members = groupData.members ?? [];

  const member: LeagueGroupMember = {
    uid,
    displayName: 'You',
    pointsThisWeek: 0,
    league,
    streakMultiplier: 1
  };

  await updateDoc(groupRef, {
    members: [...members.filter(existing => existing.uid !== uid), member]
  });

  return { ...groupData, members: [...members.filter(existing => existing.uid !== uid), member] };
};

export const updateWeeklyPoints = async (leagueId: string, member: LeagueGroupMember) => {
  const groupRef = doc(db, 'leagues', leagueId);
  const snapshot = await getDoc(groupRef);
  if (!snapshot.exists()) return;

  const group = snapshot.data() as LeagueGroup;
  const members = (group.members ?? []).filter(existing => existing.uid !== member.uid);
  await updateDoc(groupRef, { members: [...members, member] });
};

export const fetchLeaderboard = async (leagueId: string) => {
  const snapshot = await getDoc(doc(db, 'leagues', leagueId));
  if (!snapshot.exists()) return null;
  const group = snapshot.data() as LeagueGroup;
  return {
    ...group,
    members: [...group.members].sort((a, b) => b.pointsThisWeek - a.pointsThisWeek)
  };
};

export const getSeasonCountdown = () => {
  const seasonEnd = new Date();
  seasonEnd.setDate(seasonEnd.getDate() + (30 - (seasonEnd.getDate() % 30)));
  const diff = seasonEnd.getTime() - Date.now();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  return `${days} days`;
};

export const getLeagueRewards = (league: LeagueTier) => {
  const base = (leagueTiers.indexOf(league) + 1) * 100;
  return {
    placementBonus: base,
    streakMultiplierBonus: base / 2
  };
};
