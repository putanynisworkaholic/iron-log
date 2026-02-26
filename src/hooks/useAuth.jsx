import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({});
const STORAGE_KEY = "fytfynfyn_unlocked";

const USERS = [
  {
    id: "user1",
    name: import.meta.env.VITE_USER_1_NAME || "User 1",
    code: import.meta.env.VITE_USER_1_CODE || "1234",
  },
  {
    id: "user2",
    name: import.meta.env.VITE_USER_2_NAME || "User 2",
    code: import.meta.env.VITE_USER_2_CODE || "5678",
  },
];

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.unlocked && parsed.userId && parsed.name) return parsed;
    }
  } catch {}
  return null;
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = getStoredAuth();
    return stored || { unlocked: false, userId: null, name: null };
  });

  const unlock = (code) => {
    const user = USERS.find(u => u.code === code);
    if (user) {
      const state = { unlocked: true, userId: user.id, name: user.name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setAuth(state);
      return true;
    }
    return false;
  };

  const lock = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ unlocked: false, userId: null, name: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
