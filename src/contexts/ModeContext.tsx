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
  const storedMode = localStorage.getItem("adminMode");
  const initialMode = storedMode === "true" ? true : false;

  const [isAdminMode, setIsAdmin] = useState(initialMode);

  function toggleAdmin(state?: boolean) {
    if (state !== undefined) {
      setIsAdmin(state);
      localStorage.setItem("adminMode", state.toString());
    } else {
      setIsAdmin(!isAdminMode);
      localStorage.setItem("adminMode", (!isAdminMode).toString());
    }
  }

  return (
    <ModeContext.Provider value={{ isAdminMode, toggleAdmin }}>
      {children}
    </ModeContext.Provider>
  );
}
