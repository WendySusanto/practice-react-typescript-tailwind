import React, { useEffect } from "react";
import { X } from "lucide-react";

type ToastProps = {
  message: string;
  type: "success" | "info" | "warning" | "error";
  onClose: () => void;
  duration?: number;
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px]`}
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="hover:opacity-80 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
