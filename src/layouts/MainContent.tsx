import { IDLE_NAVIGATION, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import SideNavbar from "./SideNavbar";
import { useSideBarContext } from "../contexts/SidebarContext";
import Products from "../pages/products/Products";
import Sales from "../pages/sales/Sales";
import Cashier from "../pages/cashier/Cashier"; // Import the Cashier component
import NotFound from "../pages/error/NotFound";
import SalesDetail from "../pages/sales/SalesDetail";
import FullInvoiceView from "../pages/sales/FullInvoiceView";
import Member from "../pages/member/Member";
import { useEffect } from "react";
import { useModeContext } from "../contexts/ModeContext";

export default function MainContent() {
  const { isExpanded } = useSideBarContext();
  const { toggleAdmin, isAdminMode } = useModeContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isAdminMode:", isAdminMode);
    if (isAdminMode) {
      navigate("/cashier");
    }
  }, [isAdminMode, navigate]);
  return (
    <div>
      <SideNavbar />
      <div
        className={`p-8 min-h-screen transition-all duration-300 ${
          isExpanded ? "sm:ml-64" : "sm:ml-16"
        }`}
      >
        <div className="">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/receipt/:id" element={<SalesDetail />} />
            <Route path="/sales/invoice/:id" element={<FullInvoiceView />} />
            <Route path="/members" element={<Member />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
