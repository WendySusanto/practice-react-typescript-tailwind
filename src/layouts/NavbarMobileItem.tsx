import { ElementType } from "react";
import { NavLink } from "react-router-dom";

type NavbarMobileItemProps = {
  text: string;
  Icon: ElementType;
  to: string;
};

export default function NavbarMobileItem({
  text,
  Icon,
  to,
}: NavbarMobileItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center whitespace-nowrap w-16 ${
          isActive ? "text-secondary font-bold" : "text-text-muted"
        }`
      }
    >
      <Icon className="w-6 h-6 mb-1 flex-shrink-0" />
      {text}
    </NavLink>
  );
}
