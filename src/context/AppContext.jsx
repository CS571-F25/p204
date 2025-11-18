import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState([]);

  const selectRoom = (roomId) => {
    setCurrentRoomId(roomId);
  };

  const pushTerminalMessage = (entry) => {
    setTerminalOutput((prev) => {
      const next = [...prev, { id: crypto.randomUUID(), ...entry }];
      // keep only last 20 messages
      return next.slice(-20);
    });
  };

  const clearTerminal = () => setTerminalOutput([]);

  return (
    <AppContext.Provider
      value={{ currentRoomId, selectRoom, terminalOutput, pushTerminalMessage, clearTerminal }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

