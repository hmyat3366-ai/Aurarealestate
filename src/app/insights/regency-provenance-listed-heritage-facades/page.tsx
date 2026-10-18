import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "Regency Provenance: Why Listed Heritage Facades Command a 28% Value Premium — AURA Insights",
  description:
    "Evaluating the structural asset durability and historic preservation premiums of Grade I and Grade II* listed buildings across prime global architectural capitals.",
};

const DATA_POINTS = [
  { label: "Listed Building Premium", value: "+28.4%", delta: "Vs Unlisted Comps" },
  { label: "Grade I Scarcity Index", value: "< 2.5%", delta: "Of Total PCL Housing" },
  { label: "Average Value Retention", value: "96.8%", delta: "During Downturns" },
  { label: "Provenance Appreciation", value: "+5.1%", delta: "Annualized 10-Yr Rate" },
];

export default function RegencyProvenanceInsightPage() {
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
                  Regency Provenance
                </li>
              </ol>
            </nav>

            {/* Eyebrow & Meta */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#78542E] mb-6">
              <span className="uppercase tracking-[0.2em] font-semibold bg-[#F3F1EC] px-2.5 py-1 rounded-xs">
                Architectural Preservation
              </span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">August 2026</span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">4 min read</span>
              <span className="text-[#D5D1C7]" aria-hidden="true">•</span>
              <span className="text-[#8E8A80]">By Clara Montagu, Senior Associate</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#121312] font-normal tracking-tight-editorial leading-tight mb-8">
              Regency Provenance: Why Listed Heritage Facades Command a 28% Value Premium.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#4A4C48] leading-relaxed mb-10">
              Evaluating the structural asset durability, irreplaceable craftsmanship, and historical preservation premiums of Grade I and Grade II* listed buildings across prime urban conservation districts.
            </p>

            {/* Hero Image */}
            <figure className="mb-12 overflow-hidden rounded-xs border border-[#E6E4DE] bg-[#F3F1EC]">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <ArchitecturalImage
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80"
                  alt="Classic architectural heritage interior with limestone fireplace and curated mouldings"
                  width={1600}
                  height={900}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-3 bg-[#FBFBF9] border-t border-[#E6E4DE] font-mono text-[11px] text-[#78542E] flex justify-between items-center">
                <span>Portland Stone &amp; John Nash Stucco Terraces</span>
                <span className="text-[#8E8A80]">AURA Heritage Advisory Group</span>
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
                1. Irreplicability as the Ultimate Fiduciary Hedge
              </h2>
              <p>
                In an era dominated by standardized glass-and-steel engineering, the historic materiality of early 19th-century Regency architecture has emerged as an exceptional asset category. Portland stone balustrades, cast-iron acanthus balconies, and soaring proportions designed by the likes of John Nash and Decimus Burton cannot be replicated under modern labor economies. Our econometric study demonstrates that residences bearing Grade I or Grade II* statutory protection trade at an average 28.4% premium over unlisted adjacent buildings.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                2. Downside Resilience &amp; Capital Retention
              </h2>
              <p>
                During periods of broader market correction, listed architectural properties exhibit remarkable price stability. Over a ten-year cycle, heritage residences preserved 96.8% of their valuation during peak-to-trough drawdowns, outperforming generic modern luxury new-builds by nearly 12 percentage points. Institutional collectors view these properties as sovereign-grade hard assets.
              </p>

              <div className="p-6 sm:p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs my-8 border-l-4 border-l-[#78542E]">
                <p className="font-serif text-xl text-[#121312] italic mb-3">
                  &ldquo;A listed residence does not age like a standard commodity; with disciplined curatorial stewardship, every decade of provenance adds to its cultural and monetary value.&rdquo;
                </p>
                <p className="font-mono text-xs text-[#78542E] uppercase tracking-wider">
                  — Clara Montagu, Senior Associate, AURA Real Estate
                </p>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121312] font-normal pt-4">
                3. Navigating Conservation Consent &amp; Modern Comfort
              </h2>
              <p>
                The primary barrier to heritage acquisition remains the complexity of listed building consents. However, contemporary conservation engineering now permits discrete installation of underfloor hydronic climate systems, acoustic double glazing, and integrated home networks without compromising historic lath-and-plaster or stone fabric.
              </p>
            </div>

            {/* Direct Action Box */}
            <div className="mt-14 p-8 bg-[#121312] text-[#FBFBF9] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C4A882] block mb-1">
                  Heritage Valuation Advisory
                </span>
                <p className="font-serif text-xl text-[#FBFBF9]">
                  Own a listed building or seeking curatorial acquisition advice?
                </p>
              </div>
              <Link
                href="/sell#valuation-form"
                className="inline-flex items-center justify-center h-11 px-6 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-wider font-medium rounded-xs transition-colors shrink-0"
              >
                Request Heritage Appraisal
              </Link>
            </div>
          </div>
        </article>

        {/* Other Insights Navigation */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F3F1EC]/40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/insights/global-super-prime-penthouse-valuations"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              &larr; Prev: Penthouse Valuations
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium"
            >
              All Insights Archive &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
