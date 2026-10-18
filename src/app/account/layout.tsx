"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

const ACCOUNT_TABS = [
  { name: "Overview", href: "/account" },
  { name: "Saved Residences", href: "/account/saved" },
  { name: "Viewing Appointments", href: "/account/viewings" },
  { name: "Profile & Settings", href: "/account/profile" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Route guard: redirect to sign-in if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/signin?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#121312]">
        <Header />
        <main id="main-content" className="flex-grow flex items-center justify-center py-24">
          <div className="font-mono text-xs text-[#78542E] tracking-wider uppercase animate-pulse">
            Authenticating Private Client Session...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#121312]">
      <Header />

      {/* Account Header Strip */}
      <div className="bg-[#121312] text-[#FBFBF9] border-b border-[#282A27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-caption-meta uppercase tracking-widest text-[#78542E]">
                <span>Private Client Portal</span>
                <span>•</span>
                <span>London • New York • Zurich</span>
              </div>
              <h1 className="font-serif text-page-title font-normal tracking-tight mt-1">
                {user.fullName}
              </h1>
              <p className="font-mono text-body-small text-[#8E8A80] mt-1">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="self-start md:self-center px-4 py-2 border border-[#4A4C48] hover:border-[#FBFBF9] text-btn font-mono tracking-wider text-[#D5D1C7] hover:text-[#FBFBF9] rounded-xs transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav
            className="flex items-center gap-1 sm:gap-2 mt-8 -mb-px overflow-x-auto"
            aria-label="Account sections"
          >
            {ACCOUNT_TABS.map((tab) => {
              const isActive =
                tab.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2.5 font-sans text-nav-link uppercase tracking-[0.12em] whitespace-nowrap transition-colors border-b-2 rounded-t-xs ${
                    isActive
                      ? "border-[#78542E] text-[#FBFBF9] bg-[#1C1E1C] font-semibold"
                      : "border-transparent text-[#8E8A80] hover:text-[#FBFBF9] hover:bg-[#1C1E1C]/50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Account View Content */}
      <main id="main-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}
