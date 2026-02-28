import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({});
const STORAGE_KEY = "fytfynfyn_unlocked";

export const USERS = [
  { id: "user1",  code: import.meta.env.VITE_USER_1_CODE || "1234", name: import.meta.env.VITE_USER_1_NAME || "" },
  { id: "user2",  code: import.meta.env.VITE_USER_2_CODE || "5678", name: import.meta.env.VITE_USER_2_NAME || "" },
  { id: "user3",  code: "3456", name: "" },
  { id: "user4",  code: "7823", name: "" },
  { id: "user5",  code: "5541", name: "" },
  { id: "user6",  code: "2967", name: "" },
  { id: "user7",  code: "8834", name: "" },
  { id: "user8",  code: "4412", name: "" },
  { id: "user9",  code: "6619", name: "" },
  { id: "user10", code: "1357", name: "" },
];

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.unlocked && parsed.userId) return parsed;
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
