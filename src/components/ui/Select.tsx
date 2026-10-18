"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  label?: string;
  ariaLabel?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  isRequired?: boolean;
  className?: string;
}

export function Select({
  id: customId,
  name,
  label,
  ariaLabel,
  options,
  value,
  defaultValue = "",
  placeholder = "Select an option",
  onChange,
  error,
  helperText,
  disabled = false,
  isRequired = false,
  className = "",
}: SelectProps) {
  const generatedId = useId();
  const id = customId || generatedId;
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const [selectedValue, setSelectedValue] = useState<string>(value !== undefined ? value : defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Sync external controlled value
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = useCallback(
    (val: string) => {
      setSelectedValue(val);
      onChange?.(val);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onChange]
  );

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        if (!options.length) return;
        if (isOpen && highlightedIndex >= 0 && options[highlightedIndex] && !options[highlightedIndex]?.disabled) {
          selectOption(options[highlightedIndex].value);
        } else {
          setIsOpen(!isOpen);
          const initialIndex = options.findIndex((opt) => opt.value === selectedValue);
          setHighlightedIndex(initialIndex >= 0 ? initialIndex : 0);
        }
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (!options.length) return;
        if (!isOpen) {
          setIsOpen(true);
          const initialIndex = options.findIndex((opt) => opt.value === selectedValue);
          setHighlightedIndex(initialIndex >= 0 ? initialIndex : 0);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next].disabled) next++;
            return next < options.length ? next : prev;
          });
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!options.length) return;
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(options.length - 1);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next].disabled) next--;
            return next >= 0 ? next : prev;
          });
        }
        break;
      }
      case "Escape": {
        if (isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
        }
        break;
      }
      case "Home": {
        if (isOpen && options.length > 0) {
          event.preventDefault();
          const firstEnabled = options.findIndex((opt) => !opt.disabled);
          if (firstEnabled >= 0) {
            setHighlightedIndex(firstEnabled);
          }
        }
        break;
      }
      case "End": {
        if (isOpen && options.length > 0) {
          event.preventDefault();
          let lastEnabled = -1;
          for (let i = options.length - 1; i >= 0; i--) {
            if (!options[i].disabled) {
              lastEnabled = i;
              break;
            }
          }
          if (lastEnabled >= 0) {
            setHighlightedIndex(lastEnabled);
          }
        }
        break;
      }
      default: {
        // Quick typeahead match
        if (event.key.length === 1 && isOpen) {
          const char = event.key.toLowerCase();
          const matchIndex = options.findIndex(
            (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(char)
          );
          if (matchIndex >= 0) {
            setHighlightedIndex(matchIndex);
          }
        }
        break;
      }
    }
  };

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl && typeof activeEl.scrollIntoView === "function") {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, highlightedIndex]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label
          id={labelId}
          htmlFor={id}
          className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-1.5 font-medium"
        >
          {label}
          {isRequired && (
            <span className="text-[#78542E] ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Hidden input for HTML form submissions */}
      {name && <input type="hidden" name={name} value={selectedValue} />}

      {/* Combobox Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={!label ? (ariaLabel || placeholder) : undefined}
        aria-labelledby={label ? `${labelId} ${id}` : undefined}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0 && options[highlightedIndex] ? `${id}-opt-${highlightedIndex}` : undefined
        }
        aria-invalid={!!error}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (options.length > 0) {
              const initialIndex = options.findIndex((opt) => opt.value === selectedValue);
              setHighlightedIndex(initialIndex >= 0 ? initialIndex : 0);
            } else {
              setHighlightedIndex(-1);
            }
          }
        }}
        onKeyDown={handleKeyDown}
        className={`
          w-full min-h-[44px] px-3.5 py-2.5 bg-[#FFFFFF] text-left text-base font-sans
          rounded-xs border flex items-center justify-between transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-1
          ${error ? "border-red-600" : "border-[#8E8A80] hover:border-[#121312]"}
          ${disabled ? "bg-[#F3F1EC] text-[#63655E] cursor-not-allowed border-[#D5D1C7]" : "text-[#121312]"}
        `}
      >
        <span className={`truncate ${selectedOption ? "text-[#121312]" : "text-[#63655E]"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
          className={`h-4 w-4 text-[#4A4C48] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Listbox Dropdown */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          tabIndex={-1}
          className="absolute z-50 w-full mt-1 bg-[#FFFFFF] border border-[#D5D1C7] rounded-xs shadow-ambient-md max-h-60 overflow-y-auto py-1 focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    selectOption(option.value);
                  }
                }}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setHighlightedIndex(index);
                  }
                }}
                className={`
                  px-3.5 py-2.5 text-sm font-sans cursor-pointer flex items-center justify-between transition-colors
                  ${isHighlighted ? "bg-[#F3F1EC] text-[#121312]" : "text-[#4A4C48]"}
                  ${isSelected ? "font-medium text-[#121312] bg-[#F4EDE2]" : ""}
                  ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <svg
                    className="h-4 w-4 text-[#78542E] shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 font-sans">
          {error}
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
