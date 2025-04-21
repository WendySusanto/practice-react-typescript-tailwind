import { ElementType } from "react";
import { useSideBarContext } from "../contexts/SidebarContext";
import { NavLink } from "react-router-dom";

type SideNavbarItemProps = {
  text: string;
  Icon: ElementType;
  to: string;
};

export default function SideNavbarItem({
  text,
  Icon,
  to,
}: SideNavbarItemProps) {
  const { isExpanded } = useSideBarContext();

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-4 text-xl whitespace-nowrap ${
          isActive ? "text-primary- font-bold" : "text-text-muted"
        }`
      }
    >
      <Icon className="w-8 h-8 mr-3 flex-shrink-0 text-secondary" />
      <div
        className={`overflow-hidden text-secondary transition-all duration-300 ${
          isExpanded ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"
        }`}
      >
        {text}
      </div>
    </NavLink>
  );
}
