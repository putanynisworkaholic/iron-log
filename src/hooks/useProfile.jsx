import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase.jsx";

const ProfileContext = createContext({});
const getKey = (userId) => `fytfynfyn_profile_${userId}`;

function readLocal(userId) {
  if (!userId) return null;
  try {
    const s = localStorage.getItem(getKey(userId));
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function writeLocal(userId, data) {
  if (!userId) return;
  localStorage.setItem(getKey(userId), JSON.stringify(data));
}

async function fetchRemote(userId) {
  try {
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (!data) return null;
    return {
      name: data.name || "",
      split: data.split || null,
      customDays: data.custom_days || [],
      daySplit: data.day_split || {},
    };
  } catch { return null; }
}

async function saveRemote(userId, profileData) {
  try {
    await supabase.from("user_profiles").upsert({
      user_id: userId,
      name: profileData.name || "",
      split: profileData.split || null,
      custom_days: profileData.customDays || [],
      day_split: profileData.daySplit || {},
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch {}
}

export function ProfileProvider({ children }) {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    // Serve local cache instantly to avoid flicker
    const local = readLocal(userId);
    if (local) {
      setProfile(local);
      setProfileLoading(false);
      // Background sync to pick up changes from other devices
      fetchRemote(userId).then(remote => {
        if (remote) {
          writeLocal(userId, remote);
          setProfile(remote);
        }
      });
      return;
    }

    // No local cache — fetch from Supabase (first login or cleared storage)
    setProfileLoading(true);
    fetchRemote(userId).then(remote => {
      if (remote) {
        writeLocal(userId, remote);
        setProfile(remote);
      } else {
        setProfile(null);
      }
      setProfileLoading(false);
    });
  }, [userId]);

  const persist = (updated) => {
    if (!userId) return;
    writeLocal(userId, updated);
    setProfile(updated);
    saveRemote(userId, updated);
    return updated;
  };

  const saveProfile = (updates) => persist({ ...profile, ...updates });
  const updateName = (name) => saveProfile({ name });
  const updateSplit = (split) => saveProfile({ split, customDays: profile?.customDays });

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

  const addCustomDay = (day) => {
    const trimmed = day.trim();
    if (!trimmed) return;
    const customDays = profile?.customDays || [];
    if (customDays.includes(trimmed)) return;
    saveProfile({ customDays: [...customDays, trimmed] });
  };

  const removeCustomDay = (day) => {
    const customDays = (profile?.customDays || []).filter(d => d !== day);
    saveProfile({ customDays });
  };

  const resetProfile = () => {
    if (!userId) return;
    localStorage.removeItem(getKey(userId));
    setProfile(null);
    supabase.from("user_profiles").delete().eq("user_id", userId).then(() => {});
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      hasProfile: !!profile,
      profileLoading,
      saveProfile,
      updateName,
      updateSplit,
      assignExerciseToDay,
      removeExerciseFromDay,
      removeExerciseFromAllDays,
      addCustomDay,
      removeCustomDay,
      resetProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
