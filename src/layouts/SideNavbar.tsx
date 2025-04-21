import {
  Contact,
  DollarSignIcon,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import SideNavbarItem from "./SideNavbarItem";

export default function SideNavbar() {
  return (
    <aside className="py-6 px-4 shadow-md h-full sm:block hidden bg-background-dark ">
      <SideNavbarItem text="Dashboard" Icon={LayoutDashboard} to="/" />
      <SideNavbarItem text="Products" Icon={ShoppingBasket} to="/products" />
      <SideNavbarItem text="Sales" Icon={DollarSignIcon} to="/sales" />
      <SideNavbarItem text="Customers" Icon={Contact} to="/customers" />
      {/* <SideNavbarItem text="Settings" Icon={Settings} to="/settings" /> */}
    </aside>
  );
}
