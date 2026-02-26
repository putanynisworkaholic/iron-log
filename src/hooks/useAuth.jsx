import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({});
const PASSCODE = import.meta.env.VITE_PASSCODE || "1234";
const STORAGE_KEY = "ironlog_unlocked";

export function AuthProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const unlock = (code) => {
    if (code === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
  };

  return (
    <AuthContext.Provider value={{ unlocked, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
