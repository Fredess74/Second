import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

let app: FirebaseApp;

const initFirebase = () => {
  if (!getApps().length) {
    const firebaseConfig = Constants?.expoConfig?.extra?.firebase;

    if (!firebaseConfig) {
      throw new Error('Firebase configuration is missing. Make sure to define it in the .env file.');
    }

    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  return app;
};

export const firebaseApp = initFirebase();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
