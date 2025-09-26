export type LeagueTier =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Elite'
  | 'Legend'
  | 'Mythic';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  totalPoints: number;
  squadId?: string | null;
  league: LeagueTier;
  weeklyLeaguePoints: number;
  scanStreak: {
    days: number;
    lastScanDate?: string;
  };
  createdAt: string;
}

export interface Squad {
  squadId: string;
  squadName: string;
  members: string[];
  mascotStatus: 'happy' | 'excited' | 'sleepy';
  sharedGoal: {
    targetPoints: number;
    currentPoints: number;
  };
  shoppingList: Array<{
    id: string;
    itemName: string;
    addedBy: string;
    createdAt: string;
  }>;
}

export interface LeagueGroupMember {
  uid: string;
  displayName: string;
  pointsThisWeek: number;
  league: LeagueTier;
  streakMultiplier: number;
}

export interface LeagueGroup {
  leagueId: string;
  leagueName: LeagueTier;
  members: LeagueGroupMember[];
  weekStartDate: string;
  weekEndDate: string;
  weekKey?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
}
