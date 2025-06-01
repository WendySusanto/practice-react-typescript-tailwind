import React, { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={twMerge(
        `fixed inset-0 overflow-y-auto bg-black/75 flex justify-center z-99  no-scrollbar`,
        className
      )}
    >
      <div
        ref={modalRef}
        className="bg-background-muted rounded-lg shadow-lg p-6 w-full max-w-md m-auto text-text"
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {description && <p className="text-sm text-text mb-4">{description}</p>}
        {children}
      </div>
    </div>
  );
};
