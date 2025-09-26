import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '@/screens/main/HomeScreen';
import ScanReceiptModal from '@/screens/main/ScanReceiptModal';
import SquadScreen from '@/screens/squads/SquadScreen';
import SquadInviteScreen from '@/screens/squads/SquadInviteScreen';
import LeagueScreen from '@/screens/leagues/LeagueScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import { HomeStackParamList, LeagueStackParamList, MainTabParamList, ProfileStackParamList, SquadStackParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SquadStack = createNativeStackNavigator<SquadStackParamList>();
const LeagueStack = createNativeStackNavigator<LeagueStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="ScanReceiptModal" component={ScanReceiptModal} options={{ presentation: 'modal', title: 'Scan Receipt' }} />
  </HomeStack.Navigator>
);

const SquadNavigator = () => (
  <SquadStack.Navigator>
    <SquadStack.Screen name="Squad" component={SquadScreen} options={{ headerShown: false }} />
    <SquadStack.Screen name="SquadInvite" component={SquadInviteScreen} options={{ title: 'Join Squad' }} />
  </SquadStack.Navigator>
);

const LeagueNavigator = () => (
  <LeagueStack.Navigator>
    <LeagueStack.Screen name="League" component={LeagueScreen} options={{ headerShown: false }} />
  </LeagueStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
  </ProfileStack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#FF8F3F',
      tabBarInactiveTintColor: '#7F8C8D',
      tabBarStyle: { backgroundColor: '#FFFFFF' },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          HomeTab: 'home',
          SquadTab: 'people',
          LeagueTab: 'trophy',
          ProfileTab: 'person-circle'
        };
        const iconName = icons[route.name] ?? 'ellipse';
        return <Ionicons name={iconName} color={color} size={size} />;
      }
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ title: 'Home' }} />
    <Tab.Screen name="SquadTab" component={SquadNavigator} options={{ title: 'Squad' }} />
    <Tab.Screen name="LeagueTab" component={LeagueNavigator} options={{ title: 'League' }} />
    <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

export default MainNavigator;
