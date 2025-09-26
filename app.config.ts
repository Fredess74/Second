import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'Fetch Rewards MVP',
  slug: 'fetch-rewards-mvp',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'fetchapp',
  userInterfaceStyle: 'light',
  // Using Expo's default icon and splash assets to keep the repository binary-free.
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.fetchrewards.squadsleagues'
  },
  android: {
    package: 'com.fetchrewards.squadsleagues'
  },
  extra: {
    eas: {
      projectId: '00000000-0000-0000-0000-000000000000'
    },
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  }
};

export default config;
