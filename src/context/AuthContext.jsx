import { createContext, useContext, useMemo, useState } from "react";
import {
  authenticate,
  clearSession,
  createAccount,
  getSession,
  saveSession,
  updateAccountDisplayName,
} from "../utils/storage.js";

const AuthContext = createContext(null);

function generateGuestName() {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `Guest-${suffix}`;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [guestName, setGuestName] = useState(() => generateGuestName());
  const isAuthenticated = Boolean(session);

  const identity = useMemo(() => {
    if (isAuthenticated) {
      return {
        displayName: session.displayName,
        username: session.username,
        role: "owner",
      };
    }
    return { displayName: guestName, role: "guest" };
  }, [isAuthenticated, session, guestName]);

  const login = ({ username, pin }) => {
    const account = authenticate(username, pin);
    const newSession = { username: account.username, displayName: account.displayName };
    saveSession(newSession);
    setSession(newSession);
  };

  const signup = ({ username, pin, displayName }) => {
    const account = createAccount({ username, pin, displayName });
    const newSession = { username: account.username, displayName: account.displayName };
    saveSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
    setGuestName(generateGuestName());
  };

  const setDisplayName = (displayName) => {
    if (isAuthenticated && session) {
      updateAccountDisplayName(session.username, displayName);
      const updated = { ...session, displayName };
      saveSession(updated);
      setSession(updated);
    } else {
      setGuestName(displayName || generateGuestName());
    }
  };

  const value = {
    isAuthenticated,
    identity,
    login,
    signup,
    logout,
    setDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

