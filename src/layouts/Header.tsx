import { Menu, Moon, Sun } from "lucide-react";
import { useSideBarContext } from "../contexts/SidebarContext";
import { useThemeContext } from "../contexts/ThemeContext";

export default function Header() {
  const { toggle, isExpanded } = useSideBarContext();
  const { toggleDark, isDark } = useThemeContext();

  return (
    <div className="flex items-center bg-primary-dark text-white h-16 px-4 sticky w-[100%] flex-shrink-0 z-10 shadow-md">
      <button className="lg:hidden flex items-center cursor-pointer mr-3 hidden sm:block text-white">
        <Menu onClick={() => toggle()} />
      </button>
      <div className="flex whitespace-nowrap">
        Toko Sinar Terang {isExpanded.toString()} {isDark.toString()}
      </div>
      <div className="flex ml-auto">
        <div
          className={`relative w-16 h-9 rounded-full transition-colors cursor-pointer ${
            isDark ? "bg-gray-900" : "bg-gray-100"
          }`}
          onClick={() => toggleDark()}
        >
          <Sun
            className={`absolute top-2 right-2 w-5 h-5 transition-opacity ${
              isDark ? "opacity-0" : "opacity-100 text-primary-dark"
            }`}
          />
          <Moon
            className={`absolute top-2 left-2 w-5 h-5 transition-opacity ${
              isDark ? "opacity-100 text-white" : "opacity-0"
            }`}
          />
          <span
            className={`absolute top-2 left-2 w-5 h-5 rounded-full shadow-md transition-transform ${
              isDark ? "translate-x-7 bg-white" : "translate-x-0 bg-gray-900"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
