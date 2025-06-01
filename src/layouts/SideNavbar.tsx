import {
  Contact,
  DollarSignIcon,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import SideNavbarItem from "./SideNavbarItem";
import { useSideBarContext } from "../contexts/SidebarContext";

export default function SideNavbar() {
  const { isExpanded } = useSideBarContext();

  return (
    <aside
      className={`fixed top-16 left-0 h-screen py-6 px-4 shadow-md sm:block hidden bg-background-dark ${
        isExpanded ? "w-64" : "w-16"
      } transition-all duration-300`}
    >
      <SideNavbarItem text="Dashboard" Icon={LayoutDashboard} to="/" />
      <SideNavbarItem text="Products" Icon={ShoppingBasket} to="/products" />
      <SideNavbarItem text="Sales" Icon={DollarSignIcon} to="/sales" />
      <SideNavbarItem text="Members" Icon={Contact} to="/members" />
      {/* <SideNavbarItem text="Settings" Icon={Settings} to="/settings" /> */}
    </aside>
  );
}
