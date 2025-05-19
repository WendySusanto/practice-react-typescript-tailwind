import { createContext, useContext, useEffect, useState } from "react";

type SideBarContextType = {
  isExpanded: boolean;
  toggle: () => void;
};

type SidebarProviderProps = {
  children: React.ReactNode;
};

const SideBarContext = createContext<SideBarContextType | null>(null);

export function useSideBarContext() {
  const value = useContext(SideBarContext);
  if (value == null) throw Error("Cannot use outside of SidebarProvider");

  return value;
}

export function SideBarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    //initial setup
    window.innerWidth > 1024 ? setIsExpanded(true) : setIsExpanded(false);

    const handler = () => {
      if (!isScreenSmall()) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  function isScreenSmall() {
    return window.innerWidth < 1024;
  }

  function toggle() {
    setIsExpanded(!isExpanded);
  }

  return (
    <SideBarContext.Provider value={{ isExpanded, toggle }}>
      {children}
    </SideBarContext.Provider>
  );
}
