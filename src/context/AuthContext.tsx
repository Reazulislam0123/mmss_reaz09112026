"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase/client";

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
  joinHouseByCode: (code: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (data: {
    fullName: string;
    phone?: string;
    roomNo?: string;
  }) => Promise<{ success: boolean; message: string }>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<IMongoUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Sync user with MongoDB database
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
      console.warn("Could not sync with MongoDB:", e);
      setMongoUser({
        firebaseUid: fbUser.uid,
        email: fbUser.email || "",
        fullName: fbUser.displayName || "সদস্য",
        role: "member",
      });
      setIsDemoMode(false);
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
        setIsDemoMode(false);
        await syncWithDatabase(user);
      } else {
        setFirebaseUser(null);
        setMongoUser(null);
        setIsDemoMode(false);
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
        setIsDemoMode(false);
        await syncWithDatabase(cred.user);
      }
    } catch (err: any) {
      throw new Error(err.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, joinCode?: string) => {
    setLoading(true);
    try {
      if (auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        setIsDemoMode(false);
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
      throw new Error(err.message || "নিবন্ধন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (auth) {
        const cred = await signInWithPopup(auth, googleProvider);
        setIsDemoMode(false);
        await syncWithDatabase(cred.user);
      }
    } catch (err: any) {
      throw new Error(err.message || "গুগল লগইন সম্পন্ন করা যায়নি");
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
    setIsDemoMode(false);
  };

  const joinHouseByCode = async (code: string) => {
    if (!firebaseUser && !mongoUser) {
      return { success: false, message: "অনুগ্রহ করে প্রথমে লগইন করুন" };
    }
    const uid = firebaseUser?.uid || mongoUser?.firebaseUid;

    try {
      const res = await fetch("/api/houses/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: uid,
          code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "মেসে যুক্ত হওয়া যায়নি" };
      }

      if (data.user) {
        setMongoUser(data.user);
      }
      return { success: true, message: data.message || "সফলভাবে মেসে যুক্ত হয়েছেন!" };
    } catch (err: any) {
      return { success: false, message: err.message || "সার্ভার এরর" };
    }
  };

  const updateUserProfile = async (data: {
    fullName: string;
    phone?: string;
    roomNo?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const uid = firebaseUser?.uid || mongoUser?.firebaseUid;
    if (!uid) {
      return { success: false, message: "ব্যবহারকারী লগইন অবস্থায় নেই" };
    }

    try {
      // 1. Update in MongoDB Atlas
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: uid,
          fullName: data.fullName,
          phone: data.phone,
          roomNo: data.roomNo,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, message: resData.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে" };
      }

      // 2. Update Firebase displayName if logged in with Firebase Auth
      if (firebaseUser && data.fullName) {
        try {
          await updateProfile(firebaseUser, { displayName: data.fullName });
        } catch (fbErr) {
          console.warn("Could not update Firebase displayName:", fbErr);
        }
      }

      // 3. Update local state
      if (resData.user) {
        setMongoUser((prev) =>
          prev
            ? {
                ...prev,
                ...resData.user,
              }
            : resData.user
        );
      } else {
        setMongoUser((prev) =>
          prev
            ? {
                ...prev,
                fullName: data.fullName,
                phone: data.phone,
                roomNo: data.roomNo,
              }
            : null
        );
      }

      return {
        success: true,
        message: resData.message || "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",
      };
    } catch (err: any) {
      return { success: false, message: err.message || "নেটওয়ার্ক এরর" };
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
        joinHouseByCode,
        updateUserProfile,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
