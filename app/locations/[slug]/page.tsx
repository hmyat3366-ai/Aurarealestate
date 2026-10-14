import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/image";
import NextLink from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Building, Sparkles } from "lucide-react";
import { NEIGHBORHOODS } from "@/data/locations";
import { PROPERTIES } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({
    slug: n.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const neigh = NEIGHBORHOODS.find((n) => n.slug === slug);
  if (!neigh) return { title: "Location Not Found" };

  return {
    title: `${neigh.name} Area Guide | Prime London Real Estate`,
    description: neigh.description.slice(0, 160),
  };
}

export default async function NeighborhoodDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const neighborhood = NEIGHBORHOODS.find((n) => n.slug === slug);

  if (!neighborhood) {
    notFound();
  }

  // Find properties in this district (matching neighborhood name)
  const districtName = neighborhood.name.split(" ")[0].toLowerCase();
  const districtProperties = PROPERTIES.filter((p) =>
    p.location.neighborhood.toLowerCase().includes(districtName)
  );

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button */}
      <NextLink
        href="/locations"
        className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-agency-600 hover:text-agency-950 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>All London Enclaves</span>
      </NextLink>

      {/* Hero Header */}
      <div className="relative w-full h-[360px] sm:h-[480px] rounded-xl overflow-hidden shadow-premium border border-border-subtle mb-12">
        <Image
          src={neighborhood.heroImage}
          alt={neighborhood.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 text-white max-w-3xl">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent-300">
            London District Profile
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal mt-1 leading-tight">
            {neighborhood.name}
          </h1>
          <p className="text-sm sm:text-base text-agency-200 mt-2 max-w-2xl">
            {neighborhood.headline}
          </p>
        </div>
      </div>

      {/* Main Grid: Details & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start mb-20">
        {/* Left 2 Cols: Narrative & Lifestyle */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-agency-950 font-normal">
              Architectural Pedigree & Lifestyle
            </h2>
            <p className="text-agency-700 leading-relaxed text-sm sm:text-base">
              {neighborhood.description}
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-border-subtle">
            <h3 className="font-serif text-xl sm:text-2xl text-agency-950 font-normal flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-accent-600" />
              <span>District Highlights</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-agency-700">
              {neighborhood.keyHighlights.map((hl) => (
                <li key={hl} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 mr-2.5 shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-border-subtle">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-agency-600">
              Celebrated Streets & Addresses
            </h3>
            <div className="flex flex-wrap gap-2">
              {neighborhood.notableStreets.map((street) => (
                <span
                  key={street}
                  className="px-3 py-1.5 rounded bg-surface-canvas border border-border-strong text-xs text-agency-800 font-medium"
                >
                  {street}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Market Metrics Panel */}
        <aside className="bg-surface-canvas rounded-lg border border-border-strong shadow-subtle p-6 space-y-6">
          <h3 className="font-serif text-xl font-normal text-agency-950">
            Market Benchmark Metrics
          </h3>

          <div className="space-y-4 text-xs">
            <div className="pb-3 border-b border-border-subtle">
              <span className="text-agency-500 uppercase tracking-wider block mb-1">
                Prime Capital Value Benchmark
              </span>
              <span className="text-lg font-semibold text-agency-950">
                {neighborhood.avgPriceSale}
              </span>
            </div>

            <div className="pb-3 border-b border-border-subtle">
              <span className="text-agency-500 uppercase tracking-wider block mb-1">
                Prime Rental Benchmark
              </span>
              <span className="text-lg font-semibold text-agency-950">
                {neighborhood.avgPriceRent}
              </span>
            </div>

            <div className="pb-1">
              <span className="text-agency-500 uppercase tracking-wider block mb-1">
                District Partner Desk
              </span>
              <p className="text-agency-700">
                Inquiries routed directly to the Mayfair Senior Partner desk.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col space-y-2.5">
            <NextLink
              href={`/buy?location=${encodeURIComponent(neighborhood.name.split(" ")[0])}`}
              className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 rounded transition-colors"
            >
              Search Sales in {neighborhood.name.split(" ")[0]}
            </NextLink>

            <NextLink
              href={`/rent?location=${encodeURIComponent(neighborhood.name.split(" ")[0])}`}
              className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-agency-900 bg-surface-warm hover:bg-agency-100 border border-border-strong rounded transition-colors"
            >
              Search Lettings in {neighborhood.name.split(" ")[0]}
            </NextLink>
          </div>
        </aside>
      </div>

      {/* District Listings */}
      <section className="pt-12 border-t border-border-subtle">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
              Active Inventory
            </span>
            <h2 className="font-serif text-3xl text-agency-950 font-normal mt-1">
              Properties in {neighborhood.name}
            </h2>
          </div>
          <NextLink
            href={`/buy?location=${encodeURIComponent(neighborhood.name.split(" ")[0])}`}
            className="text-xs font-semibold uppercase tracking-wider text-agency-900 hover:text-accent-600 transition-colors"
          >
            <span>View All in {neighborhood.name} &rarr;</span>
          </NextLink>
        </div>

        {districtProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {districtProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-canvas rounded-lg border border-border-subtle text-sm text-agency-600">
            Currently, our instructions in {neighborhood.name} are offered via off-market private treaty. Contact our Private Office for confidential details.
          </div>
        )}
      </section>
    </div>
  );
}
