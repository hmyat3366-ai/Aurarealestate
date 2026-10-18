import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "PCL Capital Values & Yield Trajectories in Belgravia & Mayfair — AURA Insights",
  description:
    "An analysis of transaction liquidity, international buyer origins, and price stability across London SW1 and W1 garden squares.",
};

const DATA_POINTS = [
  { label: "Average Value Benchmark", value: "£2,450 / sq ft", delta: "+3.4% YoY" },
  { label: "Prime Gross Yield", value: "3.82%", delta: "+45 bps YoY" },
  { label: "International Buyer Share", value: "62.4%", delta: "Led by US & GCC" },
  { label: "Average Days to Contract", value: "74 Days", delta: "-12 Days YoY" },
];

export default function BelgraviaMayfairInsightPage() {
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
                  PCL Capital Values
                </li>
              </ol>
            </nav>

            {/* Eyebrow & Meta */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#78542E] mb-6">
              <span className="uppercase tracking-[0.2em] font-semibold bg-[#F3F1EC] px-2.5 py-1 rounded-xs">
                Prime Central London
              </span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">October 2026</span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">5 min read</span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">By Eleanor Sterling, Senior Partner</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#121312] font-normal tracking-tight-editorial leading-tight mb-8">
              PCL Capital Values &amp; Yield Trajectories in Belgravia &amp; Mayfair.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#4A4C48] leading-relaxed mb-10">
              An empirical analysis of transaction liquidity, international buyer origins, and price stability across London SW1 and W1 garden squares, highlighting resilience against broader macroeconomic headwinds.
            </p>

            {/* Hero Image */}
            <figure className="mb-12 overflow-hidden rounded-xs border border-[#E6E4DE] bg-[#F3F1EC]">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <ArchitecturalImage
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
                  alt="Historic Georgian and Regency townhouse facades in Belgravia London"
                  width={1600}
                  height={900}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-3 bg-[#FBFBF9] border-t border-[#E6E4DE] font-mono text-[11px] text-[#78542E] flex justify-between items-center">
                <span>Eaton Square &amp; Berkeley Square Valuation Index</span>
                <span className="text-[#8E8A80]">AURA Research Desk London</span>
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
                1. Structural Supply Constraints in Stucco Enclaves
              </h2>
              <p>
                Prime Central London (PCL) continues to decouple from domestic UK housing cycles. In Belgravia and Mayfair, where architectural listings are bounded by Grade I and Grade II* statutory protections, net new supply remains effectively zero. Over the last four quarters, transactions above £5,000,000 recorded a 14% increase in buyer inquiries, driven predominantly by dollar-denominated private wealth and European family offices.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                2. Yield Expansion &amp; Corporate Tenant Covenants
              </h2>
              <p>
                While capital appreciation remains the primary investment rationale for PCL freehold assets, gross rental yields have expanded by 45 basis points to an average of 3.82%. This shift reflects surging demand for turnkey, fully serviced period residences from senior multinational executives and diplomatic missions seeking flexible 24-to-36-month leases.
              </p>

              <div className="p-6 sm:p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs my-8 border-l-4 border-l-[#78542E]">
                <p className="font-serif text-xl text-[#121312] italic mb-3">
                  &ldquo;Discerning private collectors do not view a Belgravia garden square residence as a speculative liquid instrument; it is treated as an irreplaceable generational store of value comparable to high-provenance fine art.&rdquo;
                </p>
                <p className="font-mono text-xs text-[#78542E] uppercase tracking-wider">
                  — Eleanor Sterling, Senior Partner, AURA Real Estate London
                </p>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                3. The Outlook for 2027
              </h2>
              <p>
                With cross-border capital inflows remaining robust and off-market inventory commanding historic premiums, our forecasting model projects an annualized capital appreciation of 4.2% across super-prime Eaton Square, Wilton Crescent, and Mount Street assets over the next 36 months.
              </p>
            </div>

            {/* Direct Action Box */}
            <div className="mt-14 p-8 bg-[#121312] text-[#FBFBF9] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C4A882] block mb-1">
                  Private Client Advisory
                </span>
                <p className="font-serif text-xl text-[#FBFBF9]">
                  Seeking confidential advice on Mayfair or Belgravia holdings?
                </p>
              </div>
              <Link
                href="/contact?subject=PCL%20Market%20Advisory"
                className="inline-flex items-center justify-center h-11 px-6 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-wider font-medium rounded-xs transition-colors shrink-0"
              >
                Consult London Desk
              </Link>
            </div>
          </div>
        </article>

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
              href="/insights/global-super-prime-penthouse-valuations"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              Next: Penthouse Valuations &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
