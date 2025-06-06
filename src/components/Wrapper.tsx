import { Route, Routes } from "react-router-dom";
import { useThemeContext } from "../contexts/ThemeContext";
import Header from "../layouts/Header";
import MainContent from "../layouts/MainContent";
import NavbarMobile from "../layouts/NavbarMobile";
import Cashier from "../pages/cashier/Cashier";

export default function Wrapper() {
  const { isDark } = useThemeContext();
  
  return (
    <div className={`${isDark ? "dark" : "light"}`}>
      <Header />
      <div className="pt-16 bg-background min-h-screen">
        <Routes>
          <Route path="/cashier" element={<Cashier />} />
          <Route
            path="/*"
            element={
              <>
                <MainContent />
                <NavbarMobile />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
