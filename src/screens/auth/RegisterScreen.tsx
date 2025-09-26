import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/types/navigation';

const RegisterScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) => {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Oops!', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(email, password, displayName);
    } catch (error) {
      Alert.alert('Registration failed', (error as Error)?.message ?? 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FFF4D9', '#F7F7FF']} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View className="bg-surface/95 rounded-t-3xl p-6">
        <Text className="text-3xl font-bold text-secondary mb-4">Ready to Squad Up?</Text>
        <Text className="text-base text-gray-600 mb-6">Create your Fetch account and invite friends to earn rewards faster.</Text>

        <View className="space-y-3">
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-1">Display name</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Vlad the Fetcher"
              className="bg-white/85 rounded-xl px-4 py-3"
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@email.com"
              className="bg-white/85 rounded-xl px-4 py-3"
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Create a strong password"
              className="bg-white/85 rounded-xl px-4 py-3"
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-1">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Repeat your password"
              className="bg-white/85 rounded-xl px-4 py-3"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="mt-6 bg-secondary rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold text-lg">{loading ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} className="mt-4 items-center">
          <Text className="text-primary font-semibold">Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;
