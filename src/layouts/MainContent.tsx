import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import SideNavbar from "./SideNavbar";
import { useSideBarContext } from "../contexts/SidebarContext";
import Products from "../pages/products/Products";
import Sales from "../pages/sales/Sales";
import Customers from "../pages/customers/Customers";
import Cashier from "../pages/cashier/Cashier"; // Import the Cashier component

export default function MainContent() {
  const { isExpanded } = useSideBarContext();

  return (
    <div
      className={`grid h-screen transition-all duration-300 ${
        isExpanded ? "sm:grid-cols-[16rem_1fr]" : "sm:grid-cols-[4rem_1fr]"
      }`}
    >
      <SideNavbar />
      <div className="p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/cashier" element={<Cashier />} />
        </Routes>
      </div>
    </div>
  );
}
