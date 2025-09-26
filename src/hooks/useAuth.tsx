import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { auth, db } from '@/services/firebase';
import { UserProfile } from '@/types/models';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), snapshot => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      }
    });

    return unsubscribe;
  }, [user?.uid]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (credential.user) {
      await updateProfile(credential.user, { displayName });
      const userProfile: UserProfile = {
        uid: credential.user.uid,
        email: credential.user.email ?? email,
        displayName,
        totalPoints: 0,
        squadId: null,
        league: 'Bronze',
        weeklyLeaguePoints: 0,
        scanStreak: {
          days: 0
        },
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', credential.user.uid), userProfile);
      setProfile(userProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      initializing,
      login,
      register,
      logout
    }),
    [user, profile, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
