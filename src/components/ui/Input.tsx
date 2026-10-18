"use client";

import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  containerClassName?: string;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      leftAddon,
      rightAddon,
      containerClassName = "",
      isRequired = false,
      disabled = false,
      className = "",
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const isFieldRequired = isRequired || required;

    const describedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
          >
            {label}
            {isFieldRequired && (
              <span className="text-[#78542E] ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#63655E]" aria-hidden="true">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={!!error}
            aria-required={isFieldRequired}
            aria-describedby={describedBy || undefined}
            className={`
              w-full min-h-[44px] px-3.5 py-2.5 bg-[#FFFFFF] text-[#121312] text-base font-sans 
              placeholder:text-[#63655E] rounded-xs border transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-[#121312] focus:border-[#121312] focus:ring-offset-1
              ${error ? "border-red-600 focus:ring-red-600 focus:border-red-600" : "border-[#8E8A80] hover:border-[#121312]"}
              ${disabled ? "bg-[#F3F1EC] text-[#63655E] cursor-not-allowed border-[#D5D1C7]" : ""}
              ${leftAddon ? "pl-10" : ""}
              ${rightAddon ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-3.5 flex items-center text-[#63655E]">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1 font-medium"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-xs text-[#63655E] font-sans">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
