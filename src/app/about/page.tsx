import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";
import { AGENTS } from "@/data/properties";

export const metadata: Metadata = {
  title: "About Us — Agency Heritage, Curation & Leadership",
  description:
    "Founded in 2014, AURA Real Estate provides fiduciary advisory, curatorial marketing, and private representation for architecturally significant residences across London, New York, and Zurich.",
};

const STATS = [
  { value: "£1.4B+", label: "Transacted Volume", desc: "Private off-market and debut acquisitions" },
  { value: "100%", label: "Private Representation", desc: "Zero unauthorized public syndication" },
  { value: "8", label: "Prime Global Districts", desc: "Mayfair, Belgravia, Kensington, SoHo, Tribeca & Zurich" },
  { value: "24h", label: "Advisory SLA", desc: "Direct senior partner response on all inquiries" },
];

const CURATORIAL_PILLARS = [
  {
    num: "01",
    title: "Architectural Integrity",
    desc: "We represent properties where spatial proportion, materiality, and light create lasting value. From 18th-century stucco terraces to cast-iron post-industrial volumes, each residence is vetted for authentic provenance.",
  },
  {
    num: "02",
    title: "Absolute Confidentiality",
    desc: "Discretion is our foundational discipline. We operate under rigorous non-disclosure agreements, protecting the identity, financial posture, and architectural security of every private client.",
  },
  {
    num: "03",
    title: "Curatorial Monograph Marketing",
    desc: "We commission leading architectural historians, photographers, and typographers to produce custom monographs, transforming properties into revered historical and cultural narratives.",
  },
  {
    num: "04",
    title: "Global Capital Access",
    desc: "Through our tri-city desks in London, New York, and Zurich, we maintain direct personal relationships with family offices, private foundations, and international collectors of architecture.",
  },
];

export default function AboutPage() {
  const advisors = Object.values(AGENTS);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-gradient-to-b from-[#F3F1EC]/70 via-[#F8F6F2]/50 to-[#FBFBF9] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              {/* Left Column — Narrative & CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                    Agency Heritage • Established 2014
                  </p>
                </div>

                <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                  A Confluence of Architectural Discretion &amp; Fiduciary Rigor.
                </h1>

                <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed max-w-lead mb-8 sm:mb-10">
                  AURA Real Estate was founded to transcend conventional real estate brokerage. We operate as a private curatorial advisory, representing properties of notable architectural pedigree and counseling families, estates, and trusts on strategic property stewardship.
                </p>

                {/* Primary and secondary CTAs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <Link
                    href="/buy"
                    className="inline-flex items-center justify-center h-12 px-7 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                  >
                    Explore Private Portfolio
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#121312] hover:text-[#78542E] transition-colors font-medium py-2 focus-visible:outline-none focus-visible:underline group"
                  >
                    <span>Consult With Advisory</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Right Column — Large Architectural Photograph */}
              <div className="lg:col-span-5">
                <figure className="relative group">
                  {/* Subtle decorative architectural offset border */}
                  <div
                    className="absolute -inset-2.5 sm:-inset-3 border border-[#E6E4DE] rounded-xs pointer-events-none -z-10 translate-x-1.5 translate-y-1.5 opacity-60 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"
                    aria-hidden="true"
                  />

                  {/* Main Image Frame with intentional editorial aspect ratio */}
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#F3F1EC] border border-[#E6E4DE] rounded-xs shadow-ambient-lg">
                    <ArchitecturalImage
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
                      alt="Historic cast-iron architecture and classical European facade in warm morning light, representing AURA Real Estate's heritage curation"
                      loading="eager"
                      width={1600}
                      height={2000}
                      decoding="async"
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
                        Curatorial Heritage • Founded 2014
                      </span>
                    </div>

                    {/* Subtle Editorial Caption Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-[#FBFBF9]">
                      <p className="font-serif text-lg sm:text-xl font-normal leading-snug drop-shadow-sm">
                        Cast-Iron Architectural Provenance
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#E6E4DE] mt-1 opacity-90">
                        Heritage Preservation &amp; Fiduciary Stewardship
                      </p>
                    </div>
                  </div>

                  <figcaption className="sr-only">
                    Historic cast-iron architecture and classical European facade in warm morning light, representing AURA Real Estate&apos;s heritage curation.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

      {/* Key Agency Statistics */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="border-l-2 border-[#78542E] pl-4 sm:pl-6 space-y-1">
                <p className="font-serif text-section-title text-[#121312] font-normal">
                  {stat.value}
                </p>
                <p className="font-mono text-caption-meta uppercase tracking-wider text-[#78542E] font-medium">
                  {stat.label}
                </p>
                <p className="font-sans text-xs text-[#63655E] leading-normal pt-1">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curatorial Philosophy & Standards */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FBFBF9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Section Intro + Architectural Showcase Image */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <span className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Curatorial Philosophy
                </span>
                <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial mb-4">
                  The Four Pillars of AURA Real Estate
                </h2>
                <p className="font-sans text-body-regular text-[#4A4C48] leading-relaxed">
                  Every representation mandate is executed in accordance with our four foundational principles. We do not aggregate inventory; we curate living architectural history.
                </p>
              </div>

              {/* Editorial Interior Light Study Feature */}
              <figure className="relative group">
                <div
                  className="absolute -inset-2.5 sm:-inset-3 border border-[#E6E4DE] rounded-xs pointer-events-none -z-10 translate-x-1 translate-y-1 opacity-60 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden bg-[#F3F1EC] border border-[#E6E4DE] rounded-xs shadow-ambient-sm">
                  <ArchitecturalImage
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80"
                    alt="Refined interior light study with honed stone and gallery proportions, illustrating AURA Real Estate's curatorial philosophy"
                    loading="lazy"
                    width={1600}
                    height={1200}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#121312]/60 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-4 right-4 text-[#FBFBF9]">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#E6E4DE]">
                      Spatial Light &amp; Materiality Study
                    </p>
                  </div>
                </div>
                <figcaption className="mt-3 font-sans text-xs text-[#63655E] italic">
                  Proportion, honed stone, and natural illumination vetted across every represented estate.
                </figcaption>
              </figure>
            </div>

            {/* Right Column: Four Pillars Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {CURATORIAL_PILLARS.map((pillar) => (
                <div
                  key={pillar.num}
                  className="p-6 sm:p-8 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs space-y-4 shadow-ambient-xs hover:border-[#121312] transition-colors"
                >
                  <span className="font-mono text-eyebrow-label uppercase tracking-wider text-[#78542E] font-medium">
                    Pillar {pillar.num}
                  </span>
                  <h3 className="font-serif text-section-h3 text-[#121312] font-normal">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-body-small text-[#4A4C48] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Profiles Directory */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#E6E4DE] pb-8">
            <div>
              <span className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                Leadership &amp; Advisory
              </span>
              <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
                The Dedicated Partners
              </h2>
            </div>
            <p className="font-sans text-body-small text-[#4A4C48] max-w-md leading-relaxed">
              Four dedicated advisors steering private acquisitions, historic estates, prime lettings, and architectural valuation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="group flex flex-col bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#121312] hover:shadow-ambient-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F3F1EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    width={400}
                    height={500}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#121312]/80 backdrop-blur-sm px-2.5 py-0.5 text-[#FBFBF9] font-mono text-[9px] uppercase tracking-wider rounded-xs">
                    Senior Advisor
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-card-title text-[#121312] font-normal">
                      {advisor.name}
                    </h3>
                    <p className="font-mono text-caption-meta uppercase tracking-wider text-[#78542E] mt-0.5 mb-3 font-medium">
                      {advisor.title}
                    </p>
                    <p className="font-sans text-body-small text-[#4A4C48] leading-relaxed line-clamp-4">
                      {advisor.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6E4DE] space-y-1 font-mono text-caption-meta">
                    <a
                      href={`mailto:${advisor.email}`}
                      className="block text-[#121312] hover:text-[#78542E] transition-colors truncate"
                    >
                      {advisor.email}
                    </a>
                    <a
                      href={`tel:${advisor.phone.replace(/[^+\d]/g, "")}`}
                      className="block text-[#63655E] hover:text-[#121312] transition-colors"
                    >
                      {advisor.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory & Institutional Governance */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F1EC]/60 border-b border-[#E6E4DE]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] font-medium block">
            Institutional Governance &amp; Regulatory Compliance
          </span>
          <h2 className="font-serif text-section-title text-[#121312] font-normal">
            RICS Regulation &amp; Global Fiduciary Oversight
          </h2>
          <p className="font-sans text-body-small text-[#4A4C48] leading-relaxed">
            AURA Real Estate Private Real Estate LLP is fully regulated by the Royal Institution of Chartered Surveyors (RICS). All partner operations adhere strictly to the UK Money Laundering Regulations 2017 &amp; 2019, the Financial Action Task Force (FATF) guidelines, and U.S. FinCEN Real Estate Geographic Targeting Orders. Client funds are maintained in segregated statutory accounts.
          </p>
          <div className="pt-2 flex justify-center gap-6">
            <Link
              href="/contact"
              className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors border-b border-[#121312]"
            >
              Contact Advisory Board &rarr;
            </Link>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
