import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "The Wealth Report 2026 — Flagship Publication — AURA Real Estate",
  description:
    "Our definitive annual study tracking private wealth allocations, super-prime residential values, and architectural capital migration across London, New York, and European financial capitals.",
};

const CHAPTERS = [
  {
    num: "01",
    title: "Global Macroeconomic Wealth Allocations",
    summary:
      "Cross-border real estate allocations among family offices, sovereign funds, and ultra-high-net-worth principals managing $50M+ liquid wealth.",
  },
  {
    num: "02",
    title: "Super-Prime City Index 2026",
    summary:
      "Benchmarking price-per-square-foot trajectories across Mayfair, Belgravia, SoHo, Tribeca, and Zurich Bahnhofstrasse.",
  },
  {
    num: "03",
    title: "The Architectural Scarcity Premium",
    summary:
      "Evaluating how Grade I/II* listed facades and historically protected streetscapes outperform modern commodity towers.",
  },
  {
    num: "04",
    title: "Private Off-Market Liquidity Dynamics",
    summary:
      "Why over 40% of prime central transactions now transpire in private exclusive networks under bilateral non-disclosure agreements.",
  },
];

export default function WealthReportFlagshipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Report Hero Section */}
        <section className="pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-gradient-to-b from-[#F3F1EC]/70 via-[#F8F6F2]/50 to-[#FBFBF9]">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center space-x-2 font-mono text-xs text-[#8E8A80]">
                <li>
                  <Link href="/" className="hover:text-[#121312] transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/insights" className="hover:text-[#121312] transition-colors">
                    Insights
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#121312] font-medium" aria-current="page">
                  The Wealth Report 2026
                </li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                Annual Flagship Intelligence • 2026 Edition
              </p>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#121312] font-normal tracking-tight-editorial leading-tight mb-8">
              The Wealth Report: Global Super-Prime &amp; Heritage Real Estate Dynamics.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#4A4C48] leading-relaxed mb-10">
              Our comprehensive annual monograph investigating private capital allocation, architectural preservation premiums, and global transaction liquidity across London, New York, and Zurich.
            </p>

            <figure className="mb-12 overflow-hidden rounded-xs border border-[#E6E4DE] bg-[#F3F1EC]">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <ArchitecturalImage
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
                  alt="Modern glass and stone skyscraper financial capital architecture"
                  width={1600}
                  height={900}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-3 bg-[#FBFBF9] border-t border-[#E6E4DE] font-mono text-[11px] text-[#78542E] flex justify-between items-center">
                <span>Annual Publication 2026 • Curated by AURA Research Partners</span>
                <span className="text-[#8E8A80]">London • New York • Zurich</span>
              </figcaption>
            </figure>

            <div className="space-y-10">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Publication Structure
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal mb-6">
                  Key Research Chapters
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CHAPTERS.map((ch) => (
                    <div key={ch.num} className="p-6 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs space-y-2">
                      <span className="font-mono text-xs text-[#78542E] font-medium">
                        Chapter {ch.num}
                      </span>
                      <h3 className="font-serif text-lg text-[#121312] font-normal">
                        {ch.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#4A4C48] leading-relaxed">
                        {ch.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Executive Summary Section */}
              <div id="download" className="p-8 sm:p-10 bg-[#121312] text-[#FBFBF9] rounded-xs mt-12">
                <span className="font-mono text-xs uppercase tracking-widest text-[#C4A882] block mb-2">
                  Executive Monograph
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#FBFBF9] font-normal mb-4">
                  Request the Full 68-Page Executive Monograph
                </h3>
                <p className="font-sans text-sm text-[#D5D1C7] leading-relaxed max-w-xl mb-6">
                  Available exclusively to qualified institutional investors, family offices, and private clients. Includes complete econometric tables, historical indices, and micro-enclave maps.
                </p>
                <Link
                  href="/contact?subject=The%20Wealth%20Report%202026%20Download"
                  className="inline-flex items-center justify-center h-12 px-8 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm"
                >
                  Request Monograph Dispatch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other Insights Navigation */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F3F1EC]/40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              &larr; Return to All Insights
            </Link>
            <Link
              href="/insights/belgravia-mayfair-capital-values"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              Explore Belgravia &amp; Mayfair &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
