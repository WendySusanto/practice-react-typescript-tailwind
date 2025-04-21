import {
  Contact,
  DollarSignIcon,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import NavbarMobileItem from "./NavbarMobileItem";

export default function NavbarMobile() {
  return (
    <nav className="flex justify-around fixed bottom-0 left-0 right-0 py-4 shadow-lg sm:hidden bg-background-dark ">
      <NavbarMobileItem text="Dashboard" Icon={LayoutDashboard} to="/" />
      <NavbarMobileItem text="Products" Icon={ShoppingBasket} to="/products" />
      <NavbarMobileItem text="Sales" Icon={DollarSignIcon} to="/sales" />
      <NavbarMobileItem text="Customers" Icon={Contact} to="/customers" />
    </nav>
  );
}
