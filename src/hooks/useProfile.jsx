import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const ProfileContext = createContext({});
const getKey = (userId) => `fytfynfyn_profile_${userId}`;

function readProfile(userId) {
  if (!userId) return null;
  try {
    const stored = localStorage.getItem(getKey(userId));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function ProfileProvider({ children }) {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(() => readProfile(userId));

  // Re-sync when userId changes (lock/switch user)
  useEffect(() => {
    setProfile(readProfile(userId));
  }, [userId]);

  const persist = (updated) => {
    if (!userId) return;
    localStorage.setItem(getKey(userId), JSON.stringify(updated));
    setProfile(updated);
    return updated;
  };

  const saveProfile = (updates) => persist({ ...profile, ...updates });

  const updateName = (name) => saveProfile({ name });

  const updateSplit = (split) => saveProfile({ split, customDays: profile?.customDays });

  // Day Split helpers
  const assignExerciseToDay = (day, exerciseId) => {
    const daySplit = { ...profile?.daySplit };
    const current = daySplit[day] || [];
    if (!current.includes(exerciseId)) {
      daySplit[day] = [...current, exerciseId];
      saveProfile({ daySplit });
    }
  };

  const removeExerciseFromDay = (day, exerciseId) => {
    const daySplit = { ...profile?.daySplit };
    daySplit[day] = (daySplit[day] || []).filter(id => id !== exerciseId);
    saveProfile({ daySplit });
  };

  const removeExerciseFromAllDays = (exerciseId) => {
    if (!profile?.daySplit) return;
    const daySplit = {};
    Object.entries(profile.daySplit).forEach(([day, ids]) => {
      daySplit[day] = ids.filter(id => id !== exerciseId);
    });
    saveProfile({ daySplit });
  };

  const resetProfile = () => {
    if (!userId) return;
    localStorage.removeItem(getKey(userId));
    setProfile(null);
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      hasProfile: !!profile,
      saveProfile,
      updateName,
      updateSplit,
      assignExerciseToDay,
      removeExerciseFromDay,
      removeExerciseFromAllDays,
      resetProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
