import { VariantProps, cva } from "cva";
import { ComponentProps, memo } from "react";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
  [
    "transition-all", // Smooth transitions
    "cursor-pointer", // Pointer cursor
    "font-medium", // Medium font weight
    "inline-flex", // Inline flex for alignment
    "items-center", // Center items vertically
    "justify-center", // Center items horizontally
    "rounded-lg", // Rounded corners
    "focus:outline-none", // Remove default focus outline
    "focus:ring-2", // Add focus ring
    "disabled:opacity-50", // Reduce opacity when disabled
    "disabled:cursor-not-allowed", // Prevent pointer events when disabled
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary",
          "text-white",
          "hover:bg-primary-hover",
          "focus:ring-primary-light",
        ],
        outline: [
          "border",
          "border-primary",
          "text-secondary",
          "bg-transparent",
          "hover:bg-primary",
          "hover:text-white",
          "focus:ring-primary",
        ],
        ghost: [
          "bg-muted",
          "text-primary",
          "hover:bg-primary-light",
          "hover:text-white",
          "focus:ring-primary",
        ],
      },
      size: {
        sm: ["px-3", "py-1", "text-sm"],
        md: ["px-4", "py-2", "text-base"],
        lg: ["px-6", "py-3", "text-lg"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(buttonStyles({ variant, size }), className)}
    />
  );
}

export default memo(Button);
