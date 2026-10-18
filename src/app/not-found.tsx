import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
              404 • Index Reference Undefined
            </p>
            <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
          </div>

          {/* Monumental Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-tight tracking-tight-editorial text-[#121312]">
            Residence Not Found
          </h1>

          {/* Editorial Explanation */}
          <p className="font-sans text-sm sm:text-base text-[#4A4C48] leading-relaxed max-w-lg mx-auto">
            The architectural property you are seeking may have been placed privately or removed from public discovery. Our private portfolio changes continuously as acquisitions complete off-market.
          </p>

          {/* Recovery Navigation CTAs */}
          <h2 className="sr-only">Recovery Navigation</h2>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/buy"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm"
            >
              Explore Private Portfolio
            </Link>
            <Link
              href="/rent"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 border border-[#E6E4DE] bg-[#FFFFFF] hover:bg-[#F3F1EC] text-[#121312] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors"
            >
              View Turnkey Leases
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 border border-transparent text-[#78542E] hover:text-[#121312] font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Return to Residence Index &rarr;
            </Link>
          </div>

          {/* Concierge Assistance Link */}
          <div className="pt-8 border-t border-[#E6E4DE]">
            <p className="font-sans text-xs text-[#63655E]">
              Looking for a specific off-market residence?{" "}
              <Link
                href="/contact"
                className="text-[#121312] hover:text-[#78542E] underline underline-offset-4 font-medium transition-colors"
              >
                Inquire with our private client advisory desk
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
