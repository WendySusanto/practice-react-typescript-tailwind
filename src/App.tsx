import "./App.css";
import Wrapper from "./components/Wrapper";
import { ModeProvider } from "./contexts/ModeContext";

import { SideBarProvider } from "./contexts/SidebarContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <>
      <SideBarProvider>
        <ThemeProvider>
          <ModeProvider>
            <Wrapper />
          </ModeProvider>
        </ThemeProvider>
      </SideBarProvider>
    </>
  );
}

export default App;
