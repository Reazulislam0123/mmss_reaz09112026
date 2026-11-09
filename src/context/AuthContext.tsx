"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase/client";
import { MOCK_USERS } from "../lib/mockData";

export interface IMongoUser {
  firebaseUid: string;
  email: string;
  fullName: string;
  phone?: string;
  houseId?: string;
  roomNo?: string;
  role: "super_admin" | "manager" | "member";
  customRent?: number;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  mongoUser: IMongoUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, joinCode?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchDemoPersona: (uid: string) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<IMongoUser | null>(MOCK_USERS[0] as IMongoUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Sync user with database
  const syncWithDatabase = async (fbUser: FirebaseUser) => {
    try {
      const res = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          fullName: fbUser.displayName || fbUser.email?.split("@")[0] || "সদস্য",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setMongoUser(data.user);
          setIsDemoMode(false);
        }
      }
    } catch (e) {
      console.warn("Could not sync with MongoDB, falling back to local state:", e);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        await syncWithDatabase(user);
      } else {
        // Fallback to initial demo persona for instant UI readiness
        setFirebaseUser(null);
        if (!mongoUser) {
          setMongoUser(MOCK_USERS[0] as IMongoUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        await syncWithDatabase(cred.user);
      }
    } catch (err: any) {
      // If Firebase fails or is in placeholder mode, match with mock persona
      const mockMatch = MOCK_USERS.find((u) => u.email === email);
      if (mockMatch) {
        setMongoUser(mockMatch as IMongoUser);
        setIsDemoMode(true);
      } else {
        throw new Error(err.message || "লগইন ব্যর্থ হয়েছে");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, joinCode?: string) => {
    setLoading(true);
    try {
      if (auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const res = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: cred.user.uid,
            email: cred.user.email,
            fullName: name,
            joinCode,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setMongoUser(data.user);
        }
      }
    } catch (err: any) {
      // Mock registration fallback
      const newUser: IMongoUser = {
        firebaseUid: `UID_NEW_${Date.now()}`,
        email,
        fullName: name,
        role: "member",
        houseId: "HOUSE_DHAKA_01",
      };
      setMongoUser(newUser);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (auth) {
        const cred = await signInWithPopup(auth, googleProvider);
        await syncWithDatabase(cred.user);
      }
    } catch (err) {
      console.warn("Google sign-in fallback:", err);
      setMongoUser(MOCK_USERS[0] as IMongoUser);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {
      console.warn("SignOut warning:", e);
    }
    setFirebaseUser(null);
    setMongoUser(null);
  };

  const switchDemoPersona = (uid: string) => {
    const target = MOCK_USERS.find((u) => u.firebaseUid === uid);
    if (target) {
      setMongoUser(target as IMongoUser);
      setIsDemoMode(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        mongoUser,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        switchDemoPersona,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

