export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SquadTab: { squadId?: string } | undefined;
  LeagueTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ScanReceiptModal: undefined;
};

export type SquadStackParamList = {
  Squad: { squadId?: string } | undefined;
  SquadInvite: { squadId: string };
};

export type LeagueStackParamList = {
  League: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};
