import React from "react";

export type BadgeVariant =
  | "default"
  | "private_exclusive"
  | "coming_soon"
  | "active"
  | "price_improvement"
  | "under_contract"
  | "sale"
  | "rent"
  | "pending_confirmation";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  showDot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  icon,
  showDot = false,
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 font-mono uppercase font-medium rounded-xs border tracking-[0.12em] select-none whitespace-nowrap";

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    default: {
      container: "bg-[#F3F1EC] text-[#121312] border-[#D5D1C7]",
      dot: "bg-[#121312]",
    },
    private_exclusive: {
      container: "bg-[#121312] text-[#FBFBF9] border-[#78542E]/50 shadow-sm",
      dot: "bg-[#78542E]",
    },
    coming_soon: {
      container: "bg-[#F3F1EC] text-[#4A4C48] border-[#D5D1C7]",
      dot: "bg-[#4A4C48]",
    },
    active: {
      container: "bg-[#EEF2EE] text-[#23362A] border-[#23362A]/20",
      dot: "bg-[#23362A]",
    },
    price_improvement: {
      container: "bg-[#F7EFE6] text-[#5A3B18] border-[#5A3B18]/25",
      dot: "bg-[#5A3B18]",
    },
    under_contract: {
      container: "bg-[#F3F1EC] text-[#63655E] border-[#D5D1C7]",
      dot: "bg-[#63655E]",
    },
    sale: {
      container: "bg-[#EEF2EE] text-[#23362A] border-[#23362A]/20",
      dot: "bg-[#23362A]",
    },
    rent: {
      container: "bg-[#EAF0F6] text-[#192C3D] border-[#192C3D]/20",
      dot: "bg-[#192C3D]",
    },
    pending_confirmation: {
      container: "bg-[#F7EFE6] text-[#5A3B18] border-[#5A3B18]/25",
      dot: "bg-[#5A3B18]",
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[10px] leading-tight",
    md: "px-2.5 py-1 text-[11px] leading-tight",
    lg: "px-3 py-1.5 text-xs leading-normal",
  };

  const { container, dot } = variantStyles[variant];

  return (
    <span
      className={`${baseStyles} ${container} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dot} shrink-0`}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span className="inline-flex items-center shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
