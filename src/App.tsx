import "./App.css";
import Wrapper from "./components/Wrapper";
import { ModeProvider } from "./contexts/ModeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SideBarProvider } from "./contexts/SidebarContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <SideBarProvider>
      <ThemeProvider>
        <ModeProvider>
          <ToastProvider>
            <Wrapper />
          </ToastProvider>
        </ModeProvider>
      </ThemeProvider>
    </SideBarProvider>
  );
}

export default App;
