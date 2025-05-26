import { useState } from "react";

export function Tooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
