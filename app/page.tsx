import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Compass, Shield, Award, Building2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { getFeaturedProperties } from "@/data/properties";
import { NEIGHBORHOODS } from "@/data/locations";
import { AGENCY_CONFIG } from "@/config/agency";

export default function HomePage() {
  const featuredSales = getFeaturedProperties("sale").slice(0, 3);
  const featuredRentals = getFeaturedProperties("rent").slice(0, 3);
  const topNeighborhoods = NEIGHBORHOODS.slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 sm:pb-24 overflow-hidden">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Typography & Brand Narrative */}
          <div className="max-w-3xl mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-100/80 border border-accent-200/80 text-accent-800 text-xs uppercase tracking-widest font-semibold font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
              <span>Independent Prime London Advisory</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-agency-950 tracking-tight leading-[1.08]">
              Architectural Distinction. Exceptional Living.
            </h1>

            <p className="text-base sm:text-xl text-agency-600 font-light leading-relaxed max-w-2xl">
              Vane & Sterling represents an exclusively curated portfolio of prime residences across Mayfair, Kensington, Chelsea, and Belgravia. We curate, advise, and guide with uncompromising discretion.
            </p>
          </div>

          {/* Integrated Quick Search Bar */}
          <div className="relative z-10 max-w-4xl mb-12">
            <SearchBar />
          </div>

          {/* Large Hero Editorial Imagery Banner */}
          <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[580px] rounded-xl overflow-hidden shadow-hover border border-border-subtle bg-agency-100">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
              alt="Architectural Penthouse Terrace in Mayfair overlooking London skyline"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 text-white max-w-lg">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-300">
                Current Flagship Portfolio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-1 leading-snug">
                The Grosvenor Penthouse, Mayfair
              </h2>
              <p className="text-xs sm:text-sm text-agency-200 mt-1">
                4,620 sq ft lateral residence with private wraparound skyline terrace &bull; Guide Price £9,750,000
              </p>
              <div className="mt-4">
                <Link
                  href="/properties/the-grosvenor-penthouse-mayfair"
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-white hover:text-accent-300 transition-colors"
                >
                  <span>Explore Residence</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED RESIDENCES FOR SALE */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-border-subtle gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
              Acquisition Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-agency-950 font-normal mt-1">
              Prime Residences for Sale
            </h2>
            <p className="text-sm text-agency-600 mt-1 max-w-xl">
              Strictly agency-represented properties. Each home has undergone complete legal verification and architectural inspection.
            </p>
          </div>

          <Link
            href="/buy"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-agency-900 hover:text-accent-600 transition-colors shrink-0"
          >
            <span>View All Sales ({featuredSales.length}+ Residences)</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSales.map((prop, idx) => (
            <PropertyCard key={prop.id} property={prop} priority={idx === 0} />
          ))}
        </div>
      </section>

      {/* 3. PRIME RESIDENCES TO LET (RENT) */}
      <section className="bg-surface-canvas py-16 sm:py-20 border-y border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-border-subtle gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
                Executive Lettings
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-agency-950 font-normal mt-1">
                Curated Residences to Let
              </h2>
              <p className="text-sm text-agency-600 mt-1 max-w-xl">
                High-specification rental homes with transparent monthly and weekly calculations, verified availability dates, and private porter services.
              </p>
            </div>

            <Link
              href="/rent"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-agency-900 hover:text-accent-600 transition-colors shrink-0"
            >
              <span>Explore All Lettings</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRentals.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRIME NEIGHBORHOODS & ENCLAVES */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
            London Prime Enclaves
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-agency-950 font-normal mt-1">
            Curated Neighborhood Guides
          </h2>
          <p className="text-sm text-agency-600 mt-2">
            Explore the historical pedigree, architectural traditions, and lifestyle amenities that define each distinguished district.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topNeighborhoods.map((neigh) => (
            <Link
              key={neigh.id}
              href={`/locations/${neigh.slug}`}
              className="group relative h-96 rounded-lg overflow-hidden border border-border-subtle shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col justify-end p-6"
            >
              <Image
                src={neigh.heroImage}
                alt={neigh.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative z-10 text-white space-y-1.5">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-accent-300">
                  {neigh.avgPriceSale}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal group-hover:text-accent-300 transition-colors">
                  {neigh.name}
                </h3>
                <p className="text-xs text-agency-200 line-clamp-2">
                  {neigh.headline}
                </p>
                <div className="pt-2 flex items-center text-xs font-medium text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore Guide & Properties</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. THE AGENCY STANDARD & FIDUCIARY ETHOS */}
      <section className="bg-surface-canvas py-16 sm:py-24 border-y border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
                The Agency Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-agency-950 font-normal leading-tight">
                An antidote to the generic property portal.
              </h2>
              <p className="text-sm sm:text-base text-agency-600 leading-relaxed">
                Traditional portals are crowded with speculative ads, unvetted listings, and algorithmic estimates. Vane & Sterling was founded to restore the dignity of private real estate brokerage.
              </p>
              <p className="text-sm sm:text-base text-agency-600 leading-relaxed">
                Every property in our portfolio is held under exclusive agency contract. We do not permit automated public uploads. Our clients deal directly with senior equity partners possessing decades of prime market knowledge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-lg bg-surface-warm border border-border-subtle space-y-2">
                  <Award className="w-6 h-6 text-accent-600" />
                  <h4 className="font-serif text-lg font-medium text-agency-950">
                    RICS Regulated
                  </h4>
                  <p className="text-xs text-agency-600 leading-relaxed">
                    Held to the strictest global ethical standards, professional indemnity, and audited client accounting.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-surface-warm border border-border-subtle space-y-2">
                  <Shield className="w-6 h-6 text-accent-600" />
                  <h4 className="font-serif text-lg font-medium text-agency-950">
                    Discreet Advisory
                  </h4>
                  <p className="text-xs text-agency-600 leading-relaxed">
                    Trusted by diplomatic missions, family offices, and distinguished private collectors worldwide.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[420px] sm:h-[500px] rounded-lg overflow-hidden border border-border-subtle shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Vane and Sterling Mayfair Private Office Interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. SELL WITH US — PRIVATE CLIENT REPRESENTATION */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-dark text-white rounded-2xl p-8 sm:p-14 lg:p-16 border border-border-dark relative overflow-hidden shadow-hover">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-400">
              Agency Selling Service
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              Entrust Your Residence to Vane & Sterling
            </h2>
            <p className="text-sm sm:text-base text-agency-300 leading-relaxed">
              We exclusively represent vendors who value confidentiality, bespoke editorial presentation, and direct access to qualified international buyers.
            </p>

            <div className="pt-2 text-xs text-agency-400 space-y-2">
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 mr-2" />
                No public open uploads — all listings are personally managed and curated by the agency.
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 mr-2" />
                Discreet off-market campaigns available for ultra-prime trophy assets.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-agency-950 bg-white hover:bg-agency-100 rounded transition-colors shadow-sm"
              >
                <span>Request Private Valuation</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5 text-agency-950" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white border border-agency-700 hover:bg-white/10 rounded transition-colors"
              >
                <span>Our Track Record & Partners</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
