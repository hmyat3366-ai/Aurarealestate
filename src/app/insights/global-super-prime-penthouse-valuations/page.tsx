import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "The Global Super-Prime Frontier: Penthouse Valuations Across Leading Financial Capitals — AURA Insights",
  description:
    "Tracking landmark transactions exceeding £10M in London and $15M in Manhattan across world-renowned landmark developments.",
};

const DATA_POINTS = [
  { label: "London £10M+ Volume", value: "£1.85B", delta: "+11.8% YoY" },
  { label: "Manhattan $15M+ Volume", value: "$2.42B", delta: "+9.2% YoY" },
  { label: "Terrace Area Valuation", value: "52% of Living", delta: "Historical High" },
  { label: "Turnkey Design Premium", value: "+18.5%", delta: "Full Designer Staging" },
];

export default function PenthouseValuationsInsightPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Article Header */}
        <article className="pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE]">
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
                  Penthouse Valuations
                </li>
              </ol>
            </nav>

            {/* Eyebrow & Meta */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#78542E] mb-6">
              <span className="uppercase tracking-[0.2em] font-semibold bg-[#F3F1EC] px-2.5 py-1 rounded-xs">
                Super-Prime Residential
              </span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">September 2026</span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">7 min read</span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">By Julian Vane, Managing Partner</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#121312] font-normal tracking-tight-editorial leading-tight mb-8">
              The Global Super-Prime Frontier: Penthouse Valuations Across Leading Financial Capitals.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#4A4C48] leading-relaxed mb-10">
              Tracking landmark residential transactions exceeding £10M in London and $15M in Manhattan, examining the widening premium commanded by crown triplex volumes, wrap-around terraces, and architectural exclusivity.
            </p>

            {/* Hero Image */}
            <figure className="mb-12 overflow-hidden rounded-xs border border-[#E6E4DE] bg-[#F3F1EC]">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <ArchitecturalImage
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                  alt="Modern architectural penthouse terrace overlooking city skyline"
                  width={1600}
                  height={900}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-3 bg-[#FBFBF9] border-t border-[#E6E4DE] font-mono text-[11px] text-[#78542E] flex justify-between items-center">
                <span>Manhattan Billionaires&apos; Row &amp; Mayfair Crown Residences</span>
                <span className="text-[#8E8A80]">AURA Global Research Desk</span>
              </figcaption>
            </figure>

            {/* Key Empirical Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#F3F1EC]/60 border border-[#E6E4DE] rounded-xs mb-12">
              {DATA_POINTS.map((dp) => (
                <div key={dp.label} className="border-l-2 border-[#78542E] pl-3">
                  <span className="font-mono text-[10px] uppercase text-[#8E8A80] block mb-1">
                    {dp.label}
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-[#121312] font-normal block">
                    {dp.value}
                  </span>
                  <span className="font-mono text-[10px] text-[#78542E] font-medium">
                    {dp.delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Narrative Body Content */}
            <div className="space-y-8 font-sans text-base sm:text-lg text-[#282A27] leading-relaxed">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                1. The Architectural Premium of Ceiling Height &amp; Horizon Control
              </h2>
              <p>
                In both Manhattan and London, the definition of super-prime has shifted decisively upward. Transactions above $15,000,000 in Manhattan&apos;s SoHo, Tribeca, and Central Park South recorded sustained price growth. Buyers are no longer evaluating properties purely on price-per-square-foot; rather, horizontal unobstructed vistas, double-height gallery proportions (exceeding 14 feet), and acoustic insulation have become non-negotiable prerequisites.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                2. Outdoor Living Space: The Terrace Valuation Multiplier
              </h2>
              <p>
                Historically, exterior terrace square footage was discounted to 25–33% of interior valuation. In our latest dataset, private landscaped terraces offering panoramic privacy in prime enclaves are transacting at 52% of internal square-foot values. This marks an all-time high, driven by the desire for private sanctuary, outdoor sculpture pavilions, and alfresco entertaining environments.
              </p>

              <div className="p-6 sm:p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs my-8 border-l-4 border-l-[#78542E]">
                <p className="font-serif text-xl text-[#121312] italic mb-3">
                  &ldquo;A trophy penthouse represents the ultimate urban trophy: it combines the security and service of an ultra-luxury managed building with the scale and independence of a private architectural compound.&rdquo;
                </p>
                <p className="font-mono text-xs text-[#78542E] uppercase tracking-wider">
                  — Julian Vane, Managing Partner, AURA Real Estate New York
                </p>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                3. The Rise of Curatorial Turnkey Delivery
              </h2>
              <p>
                Ultra-high-net-worth purchasers increasingly refuse lengthy multi-year construction and fit-out cycles. Residences completed with museum-standard millwork, bespoke lighting, and integrated home automation command an 18.5% liquidity premium over unrenovated core-and-shell offerings.
              </p>
            </div>

            {/* Direct Action Box */}
            <div className="mt-14 p-8 bg-[#121312] text-[#FBFBF9] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C4A882] block mb-1">
                  Private Acquisitions Mandate
                </span>
                <p className="font-serif text-xl text-[#FBFBF9]">
                  Seeking an unlisted crown residence or penthouse acquisition?
                </p>
              </div>
              <Link
                href="/contact?subject=Super-Prime%20Penthouse%20Advisory"
                className="inline-flex items-center justify-center h-11 px-6 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-wider font-medium rounded-xs transition-colors shrink-0"
              >
                Engage Private Office
              </Link>
            </div>
          </div>
        </article>

        {/* Other Insights Navigation */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F3F1EC]/40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/insights/belgravia-mayfair-capital-values"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              &larr; Prev: Belgravia &amp; Mayfair
            </Link>
            <Link
              href="/insights/regency-provenance-listed-heritage-facades"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              Next: Regency Provenance &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
