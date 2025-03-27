import { useThemeContext } from "../contexts/ThemeContext";
import Header from "../layouts/Header";
import MainContent from "../layouts/MainContent";
import NavbarMobile from "../layouts/NavbarMobile";

export default function Wrapper() {
  const { isDark } = useThemeContext();
  return (
    <div className={`flex flex-col max-h-screen ${isDark ? "dark" : ""}`}>
      <Header />
      <MainContent />
      <NavbarMobile />
    </div>
  );
}
