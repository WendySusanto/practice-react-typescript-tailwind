import React, { ComponentProps } from "react";

interface TextAreaProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export function TextArea({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  ...props
}: TextAreaProps & ComponentProps<"textarea">) {
  return (
    <div>
      <label className="block text-sm font-medium text-text">{label}</label>
      <textarea
        {...props}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-secondary ${
          error ? "border-red-500" : "text-text"
        }`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
