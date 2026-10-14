"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { AGENCY_CONFIG } from "@/config/agency";
import { getStoredShortlist } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shortlistCount, setShortlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initial shortlist count
    setShortlistCount(getStoredShortlist().length);

    // Shortlist event listener
    const handleUpdate = () => {
      setShortlistCount(getStoredShortlist().length);
    };

    window.addEventListener("shortlist_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("shortlist_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Locations", href: "/locations" },
    { label: "Sell with Us", href: "/sell" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-surface-canvas/95 backdrop-blur-md border-b border-border-subtle shadow-subtle py-3.5"
          : "bg-surface-canvas border-b border-border-subtle/60 py-5"
      }`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
            aria-label="Vane & Sterling Home"
          >
            <span className="font-serif text-xl sm:text-2xl tracking-[0.22em] text-agency-950 font-medium uppercase group-hover:text-accent-500 transition-colors">
              Vane & Sterling
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-agency-500 font-sans -mt-0.5">
              London &bull; Prime Residential
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-7 lg:space-x-9"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? "text-agency-950 font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-accent-500"
                      : "text-agency-600 hover:text-agency-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Shortlist Icon */}
            <Link
              href="/saved"
              className="relative p-2 text-agency-700 hover:text-accent-500 transition-colors rounded-full focus-visible:ring-2 focus-visible:ring-accent-500"
              aria-label={`View saved properties (${shortlistCount} saved)`}
            >
              <Bookmark className="w-5 h-5 stroke-[1.5]" />
              {shortlistCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-accent-500 rounded-full">
                  {shortlistCount}
                </span>
              )}
            </Link>

            {/* Direct Phone / Contact CTA (Desktop) */}
            <a
              href={`tel:${AGENCY_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
              className="hidden lg:flex items-center text-xs tracking-wider uppercase font-medium text-agency-700 hover:text-accent-500 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 stroke-[1.75] text-accent-500" />
              <span>{AGENCY_CONFIG.contact.phoneDisplay}</span>
            </a>

            {/* Primary Action Button */}
            <Link
              href="/sell"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-medium uppercase tracking-wider text-white bg-agency-900 hover:bg-agency-950 rounded transition-colors focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <span>Sell with Us</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 stroke-[2]" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-agency-800 hover:text-agency-950 focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-6 pt-2 border-t border-border-subtle animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-3.5" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base tracking-wide py-2 px-1 border-b border-border-subtle/40 ${
                      isActive
                        ? "text-accent-500 font-medium"
                        : "text-agency-800 hover:text-agency-950"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 flex flex-col space-y-3">
                <Link
                  href="/saved"
                  className="flex items-center justify-between text-sm py-2 px-1 text-agency-700"
                >
                  <span className="flex items-center">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved Properties
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 font-medium">
                    {shortlistCount}
                  </span>
                </Link>

                <a
                  href={`tel:${AGENCY_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center text-sm py-2 px-1 text-agency-700"
                >
                  <Phone className="w-4 h-4 mr-2 text-accent-500" />
                  <span>Call {AGENCY_CONFIG.contact.phoneDisplay}</span>
                </a>

                <Link
                  href="/sell"
                  className="w-full text-center py-2.5 px-4 text-xs uppercase tracking-wider font-medium text-white bg-agency-950 rounded"
                >
                  Request Valuation (Sell with Us)
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
