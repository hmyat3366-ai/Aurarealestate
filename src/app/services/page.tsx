import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "Services & Advisory — Four Practice Pillars",
  description:
    "Comprehensive real estate advisory spanning residential sales, prime lettings, private office representation, and development consulting across London, New York, and Zurich.",
};

const PRACTICE_PILLARS = [
  {
    num: "01",
    slug: "residential-sales",
    title: "Residential Sales",
    tagline: "Prime & Super-Prime Acquisitions",
    description:
      "Discreet brokerage and fiduciary acquisition counsel for landmark townhouses, architectural lofts, and private country estates across prime global capitals.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    href: "/services/residential-sales",
    cta: "Explore Sales Advisory",
    points: [
      "Exclusive off-market inventory & private sales access",
      "Rigorous spatial, structural, and legal due diligence",
      "Discreet negotiation representing buyer or seller interests",
    ],
  },
  {
    num: "02",
    slug: "lettings-management",
    title: "Lettings & Management",
    tagline: "Turnkey Corporate & Diplomatic Leases",
    description:
      "Comprehensive tenancy curation, discrete asset stewardship, and fiduciary property management for discerning institutional and private landlords.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    href: "/services/lettings-management",
    cta: "Explore Prime Lettings",
    points: [
      "Vetted corporate, diplomatic, and executive tenancies",
      "24/7 dedicated asset management & curatorial upkeep",
      "Rent collection, deposit protection, and statutory compliance",
    ],
  },
  {
    num: "03",
    slug: "private-office",
    title: "Private Office & Acquisitions",
    tagline: "Confidential Family Office Counsel",
    description:
      "Specialist single-point advisory for international private clients, sovereign entities, and multi-family offices managing global real estate holdings.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    href: "/services/private-office",
    cta: "Engage Private Office",
    points: [
      "Absolute confidentiality under binding bilateral NDAs",
      "Cross-border portfolio allocation & capital preservation",
      "Dedicated Senior Partner as sole personal point of contact",
    ],
  },
  {
    num: "04",
    slug: "development-advisory",
    title: "Development Advisory",
    tagline: "Architectural & Masterplan Consulting",
    description:
      "Strategic pricing, spatial planning, monograph production, and global launches for prime residential development schemes and architectural restorations.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    href: "/services/development-advisory",
    cta: "Consult Development Advisory",
    points: [
      "Pre-planning unit mix, layout, and finish optimization",
      "Empirical price matrix modeling and absorption forecasting",
      "Bespoke architectural monographs and private debut campaigns",
    ],
  },
];

export default function ServicesPage() {
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
                  Services &amp; Advisory
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                  Advisory Services • Practice Architecture
                </p>
              </div>

              <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                Four Pillars of Disciplined Real Estate Advisory.
              </h1>

              <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed mb-8">
                AURA Real Estate operates across four specialized practice areas. Whether you are acquiring an off-market landmark residence, placing institutional capital, or launching an architectural development, our partners provide discreet, fiduciary counsel.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Practice Pillars List */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE]">
          <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
            {PRACTICE_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content Column */}
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] font-medium">
                      Practice Pillar {pillar.num}
                    </span>
                    <span className="text-[#E6E4DE]" aria-hidden="true">•</span>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#4A4C48]">
                      {pillar.tagline}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal mb-4">
                    {pillar.title}
                  </h2>

                  <p className="font-sans text-base text-[#4A4C48] leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {pillar.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#78542E] mt-2 shrink-0" aria-hidden="true" />
                        <span className="font-sans text-sm text-[#121312] leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center justify-center h-12 px-6 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                    >
                      {pillar.cta}
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors py-2 group"
                    >
                      <span>Inquire Directly</span>
                      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>

                {/* Architectural Image Frame */}
                <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Link href={pillar.href} className="block group">
                    <figure className="relative overflow-hidden rounded-xs border border-[#E6E4DE] bg-[#F3F1EC] transition-all duration-300 group-hover:border-[#121312] group-hover:shadow-ambient-md">
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <ArchitecturalImage
                          src={pillar.image}
                          alt={`${pillar.title} architectural case study`}
                          width={1600}
                          height={1200}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                      <figcaption className="p-4 bg-[#FBFBF9] border-t border-[#E6E4DE] flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#78542E]">
                          {pillar.title} Advisory
                        </span>
                        <span className="font-mono text-xs text-[#121312] group-hover:text-[#78542E] transition-colors">
                          View monograph &rarr;
                        </span>
                      </figcaption>
                    </figure>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Consultation Dispatch Strip */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#121312] text-[#FBFBF9]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C4A882] block mb-2 font-medium">
                Confidential Engagement
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FBFBF9] mb-3">
                Request a Confidential Advisory Consultation.
              </h2>
              <p className="font-sans text-sm text-[#D5D1C7] leading-relaxed">
                Connect directly with a Senior Partner at our London Mayfair, New York Fifth Avenue, or Zurich Bahnhofstrasse desks.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-8 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm"
              >
                Engage Advisory
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
