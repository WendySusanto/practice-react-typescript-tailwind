import "./App.css";
import Wrapper from "./components/Wrapper";

import { SideBarProvider } from "./contexts/SidebarContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <>
      <SideBarProvider>
        <ThemeProvider>
          <Wrapper />
        </ThemeProvider>
      </SideBarProvider>
    </>
  );
}

export default App;
