import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "Private Office & Acquisitions — Family Office Counsel — AURA Real Estate",
  description:
    "Specialist single-point advisory for international private clients, sovereign entities, and multi-family offices managing global prime real estate portfolios.",
};

const PILLARS = [
  {
    num: "01",
    title: "Sole Partner Representation",
    description:
      "Clients deal directly with an Equity Senior Partner. No junior delegacy or bureaucracy. A single accountable fiduciary oversees acquisitions, divestments, and structuring.",
  },
  {
    num: "02",
    title: "Bilateral Non-Disclosure Integrity",
    description:
      "All mandates are executed behind strict non-disclosure covenants. Principal identities, ultimate beneficial ownership, and commercial terms are safeguarded without exception.",
  },
  {
    num: "03",
    title: "Cross-Border Portfolio Allocation",
    description:
      "Strategic capital allocation across prime European and North American markets. We evaluate geopolitical stability, currency exposure, and long-term capital appreciation.",
  },
  {
    num: "04",
    title: "Unlisted Trophy Asset Access",
    description:
      "Direct relationships with generational families and private foundations unlock architectural estates, sovereign compounds, and heritage palazzos that will never be publicly advertised.",
  },
];

const DESKS = [
  {
    city: "London Desk",
    focus: "European Heritage & Super-Prime Central London",
    address: "14 Berkeley Square, Mayfair, London W1J 6BD",
    telephone: "+44 (0)20 7946 0880",
    email: "privateoffice@aurarealestate.com",
  },
  {
    city: "New York Desk",
    focus: "Americas Trophy Assets & Manhattan Cast-Iron",
    address: "767 Fifth Avenue, New York, NY 10153",
    telephone: "+1 (212) 555-0180",
    email: "newyork@aurarealestate.com",
  },
  {
    city: "Zurich Desk",
    focus: "Alpine Wealth & Private Banking Portfolios",
    address: "Bahnhofstrasse 45, 8001 Zürich, Switzerland",
    telephone: "+41 44 211 0180",
    email: "zurich@aurarealestate.com",
  },
];

export default function PrivateOfficePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-gradient-to-b from-[#F3F1EC]/70 via-[#F8F6F2]/50 to-[#FBFBF9] overflow-hidden">
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
                <li>
                  <Link href="/services" className="hover:text-[#121312] transition-colors">
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#121312] font-medium" aria-current="page">
                  Private Office
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              {/* Left Column — Editorial Copy */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                    Practice Pillar 03 • Family Office Counsel
                  </p>
                </div>

                <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                  Discreet Capital Placement &amp; Sovereign Family Office Advisory.
                </h1>

                <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed max-w-lead mb-8 sm:mb-10">
                  A specialist single-point advisory for international private clients, family offices, and sovereign wealth entities. We provide strategic acquisitions, confidential valuations, and cross-border portfolio allocation with absolute discretion.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <Link
                    href="/contact?subject=Private%20Office%20Advisory"
                    className="inline-flex items-center justify-center h-12 px-7 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                  >
                    Engage Private Office
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#121312] hover:text-[#78542E] transition-colors font-medium py-2 group"
                  >
                    <span>Read Fiduciary Standards</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Right Column — Editorial Image */}
              <div className="lg:col-span-5">
                <figure className="relative group">
                  <div
                    className="absolute -inset-2.5 sm:-inset-3 border border-[#E6E4DE] rounded-xs pointer-events-none -z-10 translate-x-1.5 translate-y-1.5 opacity-60 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"
                    aria-hidden="true"
                  />
                  <div className="overflow-hidden rounded-xs border border-[#E6E4DE] bg-[#F3F1EC] shadow-ambient-sm">
                    <ArchitecturalImage
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
                      alt="Prime modern private client residence and architectural pavilion with water reflection"
                      width={1600}
                      height={1200}
                      priority
                      className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-3 text-left">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] block">
                      Confidential Advisory • Private Office
                    </span>
                    <span className="font-serif text-sm text-[#121312]">
                      Alpine Lakefront Compound — Off-Market Family Office Mandate
                    </span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                Core Governance Disciplines
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal mb-4">
                Strict Confidentiality. Absolute Loyalty. Global Reach.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#4A4C48] leading-relaxed">
                Operating under rigorous fiduciary standards, our Private Office acts exclusively as trusted counsel for principal investors managing multi-jurisdictional real estate wealth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PILLARS.map((p) => (
                <div
                  key={p.num}
                  className="p-6 sm:p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#78542E] uppercase tracking-widest block mb-4 font-semibold">
                      {p.num}
                    </span>
                    <h3 className="font-serif text-xl text-[#121312] font-normal mb-3">
                      {p.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#4A4C48] leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Global Desks Directory */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#F3F1EC]/30">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-xl mb-12">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                Tri-City Advisory Hubs
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal mb-4">
                Direct Private Office Desks.
              </h2>
              <p className="font-sans text-sm text-[#4A4C48] leading-relaxed">
                Senior Partners are resident in London Mayfair, New York Fifth Avenue, and Zurich Bahnhofstrasse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {DESKS.map((d) => (
                <div key={d.city} className="p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs space-y-4">
                  <span className="font-mono text-xs text-[#78542E] uppercase tracking-widest block font-medium">
                    {d.city}
                  </span>
                  <h3 className="font-serif text-xl text-[#121312] font-normal">
                    {d.focus}
                  </h3>
                  <p className="font-sans text-xs text-[#4A4C48]">
                    {d.address}
                  </p>
                  <div className="pt-4 border-t border-[#E6E4DE] space-y-1 font-mono text-xs">
                    <p className="text-[#121312] font-medium">{d.telephone}</p>
                    <p className="text-[#78542E]">{d.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Areas Navigation Strip */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#121312] text-[#FBFBF9]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C4A882] block mb-1">
                Explore Other Advisory Desks
              </span>
              <p className="font-serif text-lg text-[#FBFBF9]">
                Residential Sales • Lettings &amp; Management • Development Advisory
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center h-10 px-6 border border-[#4A4C48] hover:border-[#FBFBF9] text-[#FBFBF9] font-sans text-xs uppercase tracking-wider transition-colors"
              >
                All Services
              </Link>
              <Link
                href="/contact?subject=Private%20Office%20Advisory"
                className="inline-flex items-center justify-center h-10 px-6 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-wider font-medium transition-colors"
              >
                Connect with Private Office
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
