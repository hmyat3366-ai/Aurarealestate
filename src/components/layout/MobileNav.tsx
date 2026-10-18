"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { AuraLogo } from "@/components/brand";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { name: "Buy", href: "/buy", subtitle: "Curated Private Residences" },
  { name: "Rent", href: "/rent", subtitle: "Turnkey Luxury Tenancies" },
  { name: "Sell with Us", href: "/sell", subtitle: "Private Valuation & Advisory" },
  { name: "About", href: "/about", subtitle: "Curatorial Philosophy & Heritage" },
  { name: "Contact", href: "/contact", subtitle: "London • New York • Zurich" },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus management & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      const closeBtn = drawerRef.current?.querySelector<HTMLElement>(
        'button[aria-label="Close menu"]'
      );
      closeBtn?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-[#121312]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 max-w-sm w-full bg-[#FBFBF9] border-l border-[#E6E4DE] shadow-ambient-lg flex flex-col justify-between p-6 z-10 overflow-y-auto animate-slide-left"
      >
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E6E4DE]">
            <AuraLogo variant="horizontal" theme="light" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-[#4A4C48] hover:text-[#121312] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-3" aria-label="Mobile menu links">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block p-3 rounded-xs transition-all ${
                    isActive
                      ? "bg-[#F3F1EC] text-[#121312] font-medium"
                      : "text-[#4A4C48] hover:text-[#121312] hover:bg-[#F3F1EC]/60"
                  }`}
                >
                  <div className="font-serif text-2xl tracking-tight">{item.name}</div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[#78542E] mt-0.5">
                    {item.subtitle}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Authentication & Account Controls */}
          <div className="mt-6 pt-6 border-t border-[#E6E4DE] space-y-3">
            {isAuthenticated && user ? (
              /* Authenticated Mobile State: Book a Valuation & MY AURA Menu */
              <div className="space-y-3">
                {/* Book a Valuation CTA */}
                <Link
                  href="/sell"
                  onClick={onClose}
                  className="block w-full py-2.5 px-4 bg-[#78542E] hover:bg-[#614324] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium text-center rounded-xs transition-colors shadow-xs"
                >
                  Book a Valuation
                </Link>

                {/* MY AURA Account Section */}
                <div className="bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E6E4DE]">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#78542E] block tracking-wider font-medium">
                        MY AURA — Private Client
                      </span>
                      <span className="font-serif text-base text-[#121312] block">
                        {user.fullName}
                      </span>
                      <span className="font-mono text-[10px] text-[#8E8A80] block truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <nav className="space-y-1 text-xs font-sans" aria-label="MY AURA mobile account links">
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="block px-3 py-2 rounded-xs text-[#121312] hover:bg-[#F3F1EC] transition-colors"
                    >
                      Overview
                    </Link>
                    <Link
                      href="/account/saved"
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2 rounded-xs text-[#121312] hover:bg-[#F3F1EC] transition-colors"
                    >
                      <span>Saved Properties</span>
                      {count > 0 && (
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-[#121312] text-[#FBFBF9] rounded-full">
                          {count}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/account/viewings"
                      onClick={onClose}
                      className="block px-3 py-2 rounded-xs text-[#121312] hover:bg-[#F3F1EC] transition-colors"
                    >
                      My Viewings &amp; Booking History
                    </Link>
                    <Link
                      href="/account/profile"
                      onClick={onClose}
                      className="block px-3 py-2 rounded-xs text-[#121312] hover:bg-[#F3F1EC] transition-colors"
                    >
                      My Profile
                    </Link>
                  </nav>

                  <div className="pt-2 border-t border-[#E6E4DE]">
                    <button
                      type="button"
                      onClick={async () => {
                        onClose();
                        await logout();
                      }}
                      className="w-full text-center py-2 text-xs font-mono text-[#DC2626] hover:bg-[#FEF2F2] rounded-xs transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Guest Mobile State: ONLY Sign In */
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="block w-full py-2.5 px-4 bg-[#121312] text-[#FBFBF9] font-sans text-xs uppercase tracking-wider text-center rounded-xs hover:bg-[#242624] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Footer / Agency Office Quick Links */}
        <div className="pt-8 border-t border-[#E6E4DE] text-xs text-[#63655E] space-y-2">
          <p className="font-mono uppercase tracking-wider text-[10px] text-[#78542E]">
            Private Client Offices
          </p>
          <p>London • New York • Zurich</p>
          <p className="font-mono text-[10px] text-[#8E8A80]">
            © 2026 AURA Real Estate LLP
          </p>
        </div>
      </div>
    </div>
  );
}
