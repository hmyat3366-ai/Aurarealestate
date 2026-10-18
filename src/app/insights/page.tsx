import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "The Wealth Report & Insights — Global Real Estate Intelligence",
  description:
    "Definitive empirical market studies, prime residential indices, and private wealth capital flows authored by AURA Real Estate global research desks.",
};

const ARTICLES = [
  {
    slug: "belgravia-mayfair-capital-values",
    category: "Prime Central London",
    date: "October 2026",
    readTime: "5 min read",
    title: "PCL Capital Values & Yield Trajectories in Belgravia & Mayfair",
    snippet:
      "An empirical analysis of transaction liquidity, international buyer origins, and price stability across London SW1 and W1 garden squares.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    href: "/insights/belgravia-mayfair-capital-values",
    keyMetric: "£2,450 / sq ft",
    metricLabel: "Average PCL Benchmark",
  },
  {
    slug: "global-super-prime-penthouse-valuations",
    category: "Super-Prime Residential",
    date: "September 2026",
    readTime: "7 min read",
    title: "The Global Super-Prime Frontier: Penthouse Valuations Across Leading Financial Capitals",
    snippet:
      "Tracking landmark transactions exceeding £10M in London and $15M in Manhattan across world-renowned landmark developments.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    href: "/insights/global-super-prime-penthouse-valuations",
    keyMetric: "+14.2%",
    metricLabel: "Annual Penthouse Premium",
  },
  {
    slug: "regency-provenance-listed-heritage-facades",
    category: "Architectural Preservation",
    date: "August 2026",
    readTime: "4 min read",
    title: "Regency Provenance: Why Listed Heritage Facades Command a 28% Value Premium",
    snippet:
      "Evaluating the structural asset durability and historic preservation premiums of Grade I and Grade II* listed buildings.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    href: "/insights/regency-provenance-listed-heritage-facades",
    keyMetric: "28.4%",
    metricLabel: "Heritage Asset Premium",
  },
];

export default function InsightsHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-gradient-to-b from-[#F3F1EC]/70 via-[#F8F6F2]/50 to-[#FBFBF9]">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center space-x-2 font-mono text-xs text-[#8E8A80]">
                <li>
                  <Link href="/" className="hover:text-[#121312] transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#121312] font-medium" aria-current="page">
                  Insights &amp; Research
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                  Global Intelligence • Thought Leadership
                </p>
              </div>

              <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                The Wealth Report &amp; Market Insights.
              </h1>

              <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed mb-8">
                Definitive empirical market studies, prime residential indices, and private wealth capital flows authored by our global research partners across London Mayfair, New York Fifth Avenue, and Zurich Bahnhofstrasse.
              </p>
            </div>
          </div>
        </section>

        {/* Flagship Publication Feature Card */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs overflow-hidden p-6 sm:p-10 lg:p-12">
              <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-xs bg-[#F3F1EC] border border-[#E6E4DE]">
                <ArchitecturalImage
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                  alt="The Wealth Report 2026 Flagship Cover"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#121312]/90 backdrop-blur-sm px-3 py-1 text-[#FBFBF9] font-mono text-[10px] uppercase tracking-wider rounded-xs">
                  Flagship Publication 2026
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#78542E] block mb-2 font-medium">
                    Annual Global Intelligence Study
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal mb-4 leading-snug">
                    The Wealth Report: Global Super-Prime &amp; Heritage Real Estate Dynamics
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#4A4C48] leading-relaxed mb-8">
                    Our definitive annual study tracking private wealth allocations, super-prime residential values, and architectural capital migration across London, New York, and European financial capitals.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#E6E4DE]">
                  <Link
                    href="/insights/wealth-report-2026"
                    className="inline-flex items-center justify-center h-12 px-7 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                  >
                    Read Full Report
                  </Link>
                  <Link
                    href="/contact?subject=The%20Wealth%20Report%202026"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors py-2 group"
                  >
                    <span>Request Executive Monograph</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Research Feed Articles Grid */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#E6E4DE] pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Curated Articles &amp; Monographs
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal">
                  Recent Intelligence Dispatches
                </h2>
              </div>
              <p className="font-sans text-xs text-[#8E8A80]">
                Peer-reviewed market analyses updated monthly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ARTICLES.map((art) => (
                <Link
                  key={art.slug}
                  href={art.href}
                  className="group flex flex-col justify-between bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-md hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-[#F3F1EC] border-b border-[#E6E4DE]">
                      <ArchitecturalImage
                        src={art.image}
                        alt={art.title}
                        width={1200}
                        height={750}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[#78542E] mb-2">
                        <span className="uppercase tracking-wider font-medium">{art.category}</span>
                        <span className="text-[#D5D1C7]">•</span>
                        <span className="text-[#8E8A80]">{art.readTime}</span>
                      </div>

                      <h3 className="font-serif text-xl text-[#121312] font-normal group-hover:text-[#78542E] transition-colors leading-snug mb-3">
                        {art.title}
                      </h3>

                      <p className="font-sans text-xs text-[#4A4C48] leading-relaxed mb-6">
                        {art.snippet}
                      </p>

                      <div className="pt-4 border-t border-[#E6E4DE] flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#8E8A80] block">
                            {art.metricLabel}
                          </span>
                          <span className="font-serif text-base text-[#121312] font-medium">
                            {art.keyMetric}
                          </span>
                        </div>
                        <span className="font-mono text-xs uppercase tracking-wider text-[#121312] group-hover:text-[#78542E] transition-colors inline-flex items-center">
                          Read &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Research Subscription Callout */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#121312] text-[#FBFBF9]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4A882] block mb-2 font-medium">
                Research Dispatches
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FBFBF9] mb-3">
                Subscribe to Institutional Market Intelligence.
              </h2>
              <p className="font-sans text-sm text-[#D5D1C7] leading-relaxed">
                Receive quarterly prime residential valuation indices, tax structuring bulletins, and confidential off-market trend papers.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/contact?subject=Research%20Subscription"
                className="inline-flex items-center justify-center h-12 px-8 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm"
              >
                Subscribe to Dispatches
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
