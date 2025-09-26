import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/types/navigation';

const LoginScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('Login failed', (error as Error)?.message ?? 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FFE0C2', '#F7F7FF']} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View className="bg-surface/90 rounded-t-3xl p-6">
        <Text className="text-3xl font-bold text-primary mb-4">Fetch Squads</Text>
        <Text className="text-base text-gray-600 mb-6">Sign in to reunite with your crew and chase rewards together.</Text>

        <View className="space-y-3">
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@email.com"
              className="bg-white/80 rounded-xl px-4 py-3"
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              className="bg-white/80 rounded-xl px-4 py-3"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="mt-6 bg-primary rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold text-lg">{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} className="mt-4 items-center">
          <Text className="text-secondary font-semibold">New to Fetch? Create an account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
