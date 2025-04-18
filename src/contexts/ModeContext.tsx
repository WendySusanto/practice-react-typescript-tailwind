import { createContext, useContext, useState } from "react";

type ModeContextType = {
  isAdminMode: boolean;
  toggleAdmin: (state?: boolean) => void;
};

type ModeProviderProps = {
  children: React.ReactNode;
};

const ModeContext = createContext<ModeContextType | null>(null);

export function useModeContext() {
  const value = useContext(ModeContext);
  if (value == null) throw Error("Cannot use outside of ModeProvider");

  return value;
}

export function ModeProvider({ children }: ModeProviderProps) {
  const [isAdminMode, setIsAdmin] = useState(false);

  function toggleAdmin(state?: boolean) {
    if (state !== undefined) {
      setIsAdmin(state);
    } else {
      setIsAdmin(!isAdminMode);
    }
  }

  return (
    <ModeContext.Provider value={{ isAdminMode, toggleAdmin }}>
      {children}
    </ModeContext.Provider>
  );
}
