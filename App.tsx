import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TailwindProvider } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { LinkingOptions } from '@react-navigation/native';
import { useMemo } from 'react';

import RootNavigator from '@/navigation/RootNavigator';
import { AuthProvider } from '@/hooks/useAuth';
import { RootStackParamList } from '@/types/navigation';

const queryClient = new QueryClient();

const App = () => {
  const linking = useMemo<LinkingOptions<RootStackParamList>>(
    () => ({
      prefixes: ['fetchapp://', 'https://fetchapp.app'],
      config: {
        screens: {
          Auth: {
            screens: {
              Login: 'login',
              Register: 'register'
            }
          },
          Main: {
            screens: {
              HomeTab: {
                screens: {
                  Home: '',
                  ScanReceiptModal: 'scan'
                }
              },
              SquadTab: {
                screens: {
                  Squad: 'squad/:squadId?',
                  SquadInvite: 'squad/join/:squadId'
                }
              },
              LeagueTab: {
                screens: {
                  League: 'league'
                }
              },
              ProfileTab: {
                screens: {
                  Profile: 'profile'
                }
              }
            }
          }
        }
      }
    }),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TailwindProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavigationContainer linking={linking}>
              <RootNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </AuthProvider>
        </QueryClientProvider>
      </TailwindProvider>
    </GestureHandlerRootView>
  );
};

export default App;
