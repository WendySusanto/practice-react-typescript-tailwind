import { createContext, useContext, useState } from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleDark: () => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useThemeContext() {
  const value = useContext(ThemeContext);
  if (value == null) throw Error("Cannot use outside of ThemeProvider");

  return value;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme === "dark" ? true : false;

  const [isDark, setIsDark] = useState(initialTheme);

  function toggleDark() {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
