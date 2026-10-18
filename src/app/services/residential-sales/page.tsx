import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";
import { PROPERTIES } from "@/data/properties";
import { PropertyCard } from "@/components/discovery/PropertyCard";

export const metadata: Metadata = {
  title: "Residential Sales & Prime Acquisitions — AURA Real Estate",
  description:
    "Discreet brokerage and fiduciary acquisition counsel for landmark townhouses, architectural lofts, and private country estates across London, New York, and Zurich.",
};

const PILLARS = [
  {
    num: "01",
    title: "Off-Market Intelligence",
    description:
      "Over 40% of our prime central transactions occur outside public MLS and portal channels. We provide qualified private buyers with discreet access to unlisted trophy assets and generational estates.",
  },
  {
    num: "02",
    title: "Forensic Due Diligence",
    description:
      "Every acquisition is subjected to architectural vetting, structural provenance reviews, leasehold and title scrutiny, and historical deed analysis before contractual commitment.",
  },
  {
    num: "03",
    title: "Fiduciary Price Negotiation",
    description:
      "We operate with sole agency loyalty. Our partners leverage proprietary transaction comps, spatial yield modeling, and macroeconomic intelligence to secure optimal terms for our clients.",
  },
  {
    num: "04",
    title: "Turnkey Post-Settlement Care",
    description:
      "From bespoke interior curation and conservation architect introductions to private security staffing and residency formalities, our counsel extends well beyond closing.",
  },
];

export default function ResidentialSalesPage() {
  const featuredSales = PROPERTIES.filter((p) => p.listingType === "sale").slice(0, 3);

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
                  Residential Sales
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              {/* Left Column — Editorial Copy */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                    Practice Pillar 01 • Prime Acquisitions
                  </p>
                </div>

                <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                  Acquisition Counsel for Architecturally Rare Residences.
                </h1>

                <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed max-w-lead mb-8 sm:mb-10">
                  Discreet brokerage for landmark townhouses, historic cast-iron lofts, and private country estates. We represent private individuals, trusts, and family offices in navigating super-prime acquisitions with absolute confidentiality.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <Link
                    href="/buy"
                    className="inline-flex items-center justify-center h-12 px-7 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                  >
                    View Sales Portfolio
                  </Link>
                  <Link
                    href="/contact?subject=Residential%20Sales%20Advisory"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#121312] hover:text-[#78542E] transition-colors font-medium py-2 group"
                  >
                    <span>Engage Sales Advisory</span>
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
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                      alt="Prime architectural residential terrace at dusk"
                      width={1600}
                      height={1200}
                      priority
                      className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-3 text-left">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] block">
                      Architectural Case Study • Super-Prime Sales
                    </span>
                    <span className="font-serif text-sm text-[#121312]">
                      Mayfair Penthouse Pavilion — Private Placement
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
                Our Advisory Discipline
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal mb-4">
                How We Represent Discerning Purchasers &amp; Vendors.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#4A4C48] leading-relaxed">
                Rather than acting as mass-market listing aggregators, we deliver bespoke advisory tailored to prime and super-prime asset classes.
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

        {/* Current Curated Portfolio Preview */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#F3F1EC]/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
                  Active Collection
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#121312] font-normal">
                  Selected Residences for Acquisition.
                </h2>
              </div>
              <Link
                href="/buy"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#121312] hover:text-[#78542E] transition-colors font-medium group"
              >
                <span>View All 8 Sale Listings</span>
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSales.map((property) => (
                <PropertyCard key={property.id} property={property} />
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
                Lettings &amp; Management • Private Office • Development Advisory
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
                href="/contact?subject=Residential%20Sales%20Advisory"
                className="inline-flex items-center justify-center h-10 px-6 bg-[#FBFBF9] text-[#121312] hover:bg-[#E6E4DE] font-sans text-xs uppercase tracking-wider font-medium transition-colors"
              >
                Contact Sales Desk
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
