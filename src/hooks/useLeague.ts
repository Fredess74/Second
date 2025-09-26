import { useCallback, useEffect, useState } from 'react';

import { useAuth } from './useAuth';
import { LeagueGroup, LeagueGroupMember } from '@/types/models';
import { fetchLeaderboard, getLeagueRewards, getOrCreateLeagueGroup, getSeasonCountdown } from '@/services/leagueService';

export const useLeague = () => {
  const { profile } = useAuth();
  const [group, setGroup] = useState<LeagueGroup | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeagueGroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonCountdown, setSeasonCountdown] = useState(getSeasonCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeasonCountdown(getSeasonCountdown());
    }, 1000 * 60 * 60 * 12);
    return () => clearInterval(interval);
  }, []);

  const refresh = useCallback(async () => {
    if (!profile?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const currentGroup = await getOrCreateLeagueGroup(profile.league, profile.uid);
      setGroup(currentGroup);
      const data = await fetchLeaderboard(currentGroup.leagueId);
      if (data) {
        setLeaderboard(data.members);
      }
    } finally {
      setLoading(false);
    }
  }, [profile?.league, profile?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rewards = profile ? getLeagueRewards(profile.league) : { placementBonus: 0, streakMultiplierBonus: 0 };

  return {
    group,
    leaderboard,
    loading,
    refresh,
    rewards,
    seasonCountdown
  };
};
