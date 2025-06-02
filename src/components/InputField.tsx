import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  className,
  ...props
}: InputFieldProps & ComponentProps<"input">) {
  return (
    <div>
      <label className="block text-sm font-medium text-text">{label}</label>
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={twMerge(
          `w-full border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-secondary ${
            error ? "border-red-500" : "text-text"
          }`,
          className
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
