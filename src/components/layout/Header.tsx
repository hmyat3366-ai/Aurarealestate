"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { MobileNav } from "./MobileNav";
import { AuraLogo } from "@/components/brand";

const NAV_ITEMS = [
  { name: "Buy", href: "/buy" },
  { name: "Rent", href: "/rent" },
  { name: "Sell with Us", href: "/sell" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close account menu on outside click or Escape key
  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setAccountMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountMenuOpen]);

  // Keyboard navigation inside dropdown menu
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setAccountMenuOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const menu = menuRef.current;
      if (!menu) return;
      const items = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
      );
      if (items.length === 0) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex = 0;
      if (e.key === "ArrowDown") {
        nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
      } else {
        nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      }
      items[nextIndex]?.focus();
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setAccountMenuOpen(true);
      setTimeout(() => {
        const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
        firstItem?.focus();
      }, 50);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E6E4DE] transition-colors duration-200">
        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Mark: Compact Horizontal Logo Variant */}
          <Link
            href="/"
            className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] rounded-xs transition-opacity duration-200 hover:opacity-90"
            aria-label="AURA Real Estate — Return to Homepage"
          >
            <AuraLogo variant="horizontal" theme="light" />
          </Link>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative font-sans text-xs uppercase tracking-[0.14em] transition-colors duration-150 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] rounded-xs ${
                    isActive
                      ? "text-[#121312] font-semibold"
                      : "text-[#4A4C48] hover:text-[#121312]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#78542E] transition-all"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Session loading state placeholder (prevents flash of incorrect state) */}
            {isLoading ? (
              <div
                className="hidden sm:block h-9 w-24 bg-[#E6E4DE]/50 rounded-xs animate-pulse"
                aria-hidden="true"
              />
            ) : isAuthenticated && user ? (
              /* Authenticated State: ONLY "BOOK A VALUATION" and "MY AURA" */
              <>
                {/* 1. BOOK A VALUATION CTA */}
                <Link
                  href="/sell"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#78542E] hover:bg-[#614324] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78542E]"
                >
                  Book a Valuation
                </Link>

                {/* 2. MY AURA Account Menu */}
                <div className="relative hidden sm:block" ref={menuRef}>
                  <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    onKeyDown={handleTriggerKeyDown}
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                    aria-controls="my-aura-account-menu"
                    aria-label="MY AURA account menu"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xs border border-[#E6E4DE] bg-[#FFFFFF] hover:border-[#121312] transition-colors text-xs font-sans text-[#121312] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#78542E]" aria-hidden="true" />
                    <span className="font-sans font-medium uppercase tracking-wider text-[11px]">
                      MY AURA
                    </span>
                    <svg
                      className={`w-3 h-3 text-[#63655E] transition-transform duration-200 ${
                        accountMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {accountMenuOpen && (
                    <div
                      id="my-aura-account-menu"
                      role="menu"
                      aria-label="MY AURA Account Menu"
                      onKeyDown={handleMenuKeyDown}
                      className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs shadow-ambient-md py-2 z-50 text-xs font-sans animate-fade-in"
                    >
                      <div className="px-4 py-2.5 border-b border-[#E6E4DE] text-[11px] text-[#63655E]">
                        <span className="block font-mono text-[10px] uppercase text-[#78542E] font-medium tracking-wider">
                          MY AURA Client
                        </span>
                        <span className="font-medium text-[#121312] truncate block mt-0.5">
                          {user.fullName}
                        </span>
                        <span className="font-mono text-[10px] text-[#8E8A80] truncate block">
                          {user.email}
                        </span>
                      </div>

                      <div className="py-1" role="none">
                        <Link
                          href="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-[#F3F1EC] text-[#121312] transition-colors focus:bg-[#F3F1EC] focus:outline-none"
                          role="menuitem"
                        >
                          Overview
                        </Link>
                        <Link
                          href="/account/saved"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2 hover:bg-[#F3F1EC] text-[#121312] transition-colors focus:bg-[#F3F1EC] focus:outline-none"
                          role="menuitem"
                        >
                          <span>Saved Properties</span>
                          {count > 0 && (
                            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#121312] text-[#FBFBF9] rounded-full">
                              {count}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/account/viewings"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-[#F3F1EC] text-[#121312] transition-colors focus:bg-[#F3F1EC] focus:outline-none"
                          role="menuitem"
                        >
                          My Viewings &amp; Booking History
                        </Link>
                        <Link
                          href="/account/profile"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-[#F3F1EC] text-[#121312] transition-colors focus:bg-[#F3F1EC] focus:outline-none"
                          role="menuitem"
                        >
                          My Profile
                        </Link>
                      </div>

                      <div className="border-t border-[#E6E4DE] my-1" role="none" />

                      <button
                        type="button"
                        onClick={async () => {
                          setAccountMenuOpen(false);
                          await logout();
                        }}
                        className="w-full text-left px-4 py-2 text-[#DC2626] hover:bg-[#FEF2F2] transition-colors font-mono text-[11px] focus:bg-[#FEF2F2] focus:outline-none"
                        role="menuitem"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest State: ONLY "SIGN IN" (Book a Valuation, MY AURA, and separate Saved are hidden) */
              <Link
                href="/auth/signin"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#121312] hover:bg-[#242624] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 text-[#121312] hover:bg-[#F3F1EC] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312]"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
