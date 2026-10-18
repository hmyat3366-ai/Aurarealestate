import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { SellInquiryForm } from "@/components/inquiry/SellInquiryForm";

export const metadata: Metadata = {
  title: "Sell with Us — Private Exclusives & Owner Valuation",
  description:
    "Confidential off-market placement, architectural monographs, and fiduciary representation for distinctive residential estates in London, New York, and Zurich.",
};

export default function SellPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-gradient-to-b from-[#F3F1EC]/70 via-[#F8F6F2]/50 to-[#FBFBF9] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              {/* Left Column — Hero Content */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                    Private Exclusives • Owner Representation
                  </p>
                </div>

                <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                  Discreet Representation for Architecturally Significant Residences.
                </h1>

                <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed max-w-lead mb-8 sm:mb-10">
                  We curate off-market placements and bespoke public debuts for prime townhouses, penthouses, and private estates. Every transaction is conducted with absolute discretion, institutional rigor, and direct partner stewardship.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
                  <a
                    href="#valuation-form"
                    className="inline-flex items-center justify-center h-12 px-7 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                  >
                    Request a Confidential Valuation
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#121312] hover:text-[#78542E] transition-colors font-medium py-2 focus-visible:outline-none focus-visible:underline group"
                  >
                    <span>Contact Our Team</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                {/* Editorial Micro-Trust Indicators */}
                <div className="pt-6 border-t border-[#E6E4DE] grid grid-cols-3 gap-4 sm:gap-6 text-left">
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#121312] font-normal">100%</p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-0.5">Strict Confidentiality</p>
                  </div>
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#121312] font-normal">£1.4B+</p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-0.5">Curated Volume</p>
                  </div>
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#121312] font-normal">Partner-Led</p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-0.5">Fiduciary Oversight</p>
                  </div>
                </div>
              </div>

              {/* Right Column — Architectural Photography */}
              <div className="lg:col-span-5">
                <figure className="relative group">
                  {/* Subtle decorative architectural offset border */}
                  <div 
                    className="absolute -inset-2.5 sm:-inset-3 border border-[#E6E4DE] rounded-xs pointer-events-none -z-10 translate-x-1.5 translate-y-1.5 opacity-60 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"
                    aria-hidden="true" 
                  />

                  {/* Main Image Frame with intentional editorial aspect ratio */}
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#F3F1EC] border border-[#E6E4DE] rounded-xs shadow-ambient-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                      alt="Architecturally significant modern residential estate with limestone finishes and natural light, represented privately by AURA Real Estate"
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102"
                    />

                    {/* Subtle warm ambient gradient overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-[#121312]/70 via-[#121312]/15 to-transparent opacity-80 pointer-events-none" 
                      aria-hidden="true"
                    />

                    {/* Architectural Provenance Badge Overlay */}
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121312]/85 backdrop-blur-md text-[#FBFBF9] font-mono text-[11px] uppercase tracking-[0.14em] rounded-xs border border-white/10 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A882]" aria-hidden="true" />
                        Private Placement • Prime Enclave
                      </span>
                    </div>

                    {/* Subtle Editorial Caption Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-[#FBFBF9]">
                      <p className="font-serif text-lg sm:text-xl font-normal leading-snug drop-shadow-sm">
                        The Grosvenor Belvedere Pavilion
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#E6E4DE] mt-1 opacity-90">
                        Discreet Off-Market Disposition • Belgravia, London
                      </p>
                    </div>
                  </div>

                  {/* Accessible figcaption */}
                  <figcaption className="sr-only">
                    The Grosvenor Belvedere Pavilion — Discreet Off-Market Disposition in Belgravia, London, represented exclusively by AURA Real Estate.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition / 3 Pillars */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-section-title text-[#121312] font-normal mb-8">
              Our Fiduciary Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78542E] font-medium">
                Pillar 01
              </span>
              <h3 className="font-serif text-section-h3 text-[#121312] font-normal">
                100% Off-Market Discretion
              </h3>
              <p className="font-sans text-sm text-[#4A4C48] leading-relaxed">
                Your residence never touches public listing portals or automated syndication engines unless explicitly authorized. We match your property directly to registered family offices and pre-qualified buyers under strict non-disclosure agreements.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78542E] font-medium">
                Pillar 02
              </span>
              <h3 className="font-serif text-section-h3 text-[#121312] font-normal">
                Architectural Monograph Production
              </h3>
              <p className="font-sans text-sm text-[#4A4C48] leading-relaxed">
                We produce museum-grade collateral for every residence: architectural photography, cinematic light studies, historical provenance documentation, and bespoke linen-bound hardback monographs distributed directly to qualified principals.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78542E] font-medium">
                Pillar 03
              </span>
              <h3 className="font-serif text-section-h3 text-[#121312] font-normal">
                Managing Partner Oversight
              </h3>
              <p className="font-sans text-sm text-[#4A4C48] leading-relaxed">
                You will not be delegated to junior associates. Founding partners Julian Vane and Eleanor Sterling personally manage property valuation, marketing strategy, private showings, and contract negotiation.
              </p>
            </div>
          </div>

          {/* Performance Statistics */}
          <div className="mt-14 pt-10 border-t border-[#E6E4DE] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#121312]">£1.4B+</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-1">
                Transacted Volume
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#121312]">94%</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-1">
                Private Off-Market Sales Ratio
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#121312]">60 Days</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-1">
                Average Placement Window
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl text-[#121312]">100%</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#78542E] mt-1">
                Fiduciary Compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Intake Form Section */}
      <section id="valuation-form" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBFBF9] scroll-mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-section-title text-[#121312] font-normal mb-8">
            Confidential Valuation Advisory
          </h2>
          {/* Intake Form */}
          <SellInquiryForm />

          {/* Private Client Desk Callout */}
          <div id="private-client-desk" className="mt-12 p-6 sm:p-8 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-6 scroll-mt-12">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78542E] block font-medium">
                Direct Principal Contact
              </span>
              <h3 className="font-serif text-section-h3 text-[#121312] font-normal">
                Private Client Office (Acquisitions &amp; Exclusives)
              </h3>
              <p className="font-sans text-xs text-[#63655E]">
                Prefer a confidential telephone briefing or private boardroom appointment?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono">
              <a
                href="tel:+442079460880"
                className="inline-flex items-center gap-2 text-[#121312] hover:text-[#78542E] transition-colors py-2 px-3 border border-[#E6E4DE] rounded-xs"
              >
                <span>+44 (0)20 7946 0880</span>
              </a>
              <a
                href="mailto:privateoffice@aurarealestate.com"
                className="inline-flex items-center gap-2 text-[#121312] hover:text-[#78542E] transition-colors py-2 px-3 border border-[#E6E4DE] rounded-xs"
              >
                <span>privateoffice@aurarealestate.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
