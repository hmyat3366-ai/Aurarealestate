"use client";

import React, { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "bronze";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base layout, typography & transition
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 select-none rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

    // Visual variants
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#121312] text-[#FBFBF9] hover:bg-[#282A27] active:scale-[0.99] border border-[#121312] shadow-sm",
      secondary:
        "bg-transparent text-[#121312] border border-[#121312] hover:bg-[#121312] hover:text-[#FBFBF9] active:scale-[0.99]",
      outline:
        "bg-transparent text-[#121312] border border-[#D5D1C7] hover:border-[#8E8A80] hover:bg-[#F3F1EC] active:scale-[0.99]",
      ghost:
        "bg-transparent text-[#121312] hover:bg-[#F3F1EC] active:bg-[#E6E3DC]",
      bronze:
        "bg-[#78542E] text-[#FBFBF9] hover:bg-[#614324] border border-[#78542E] shadow-sm active:scale-[0.99]",
    };

    // Responsive sizes with WCAG touch target compliance
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-9 px-3.5 text-xs uppercase tracking-[0.08em] min-h-[36px]",
      md: "h-11 px-5 text-sm tracking-wide min-h-[44px]",
      lg: "h-13 py-3.5 px-7 text-base tracking-normal min-h-[48px]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!isLoading && leftIcon && (
          <span className="mr-2 inline-flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span>{isLoading && loadingText ? loadingText : children}</span>

        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
