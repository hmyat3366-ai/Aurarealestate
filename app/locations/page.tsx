import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import { NEIGHBORHOODS } from "@/data/locations";

export const metadata = {
  title: "Prime London Neighborhood Guides | Mayfair, Kensington, Chelsea, Belgravia",
  description:
    "Curated guides to Prime Central London's most distinguished residential enclaves. Explore architecture, average prices per square foot, and exclusive properties.",
};

export default function LocationsPage() {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-14 space-y-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
          Geographic Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-agency-950 font-normal leading-tight">
          Prime London Enclaves
        </h1>
        <p className="text-base sm:text-lg text-agency-600 font-light leading-relaxed">
          From the classical garden squares of Mayfair and Belgravia to the bohemian river walks of Chelsea and the pastoral tranquility of Richmond, explore London’s finest addresses.
        </p>
      </div>

      {/* Grid of Neighborhoods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {NEIGHBORHOODS.map((neigh) => (
          <article
            key={neigh.id}
            className="group bg-surface-canvas rounded-lg overflow-hidden border border-border-subtle shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col"
          >
            {/* Image Banner */}
            <Link
              href={`/locations/${neigh.slug}`}
              className="relative block w-full aspect-[16/10] overflow-hidden bg-agency-100"
            >
              <Image
                src={neigh.heroImage}
                alt={neigh.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-300">
                  Avg. {neigh.avgPriceSale}
                </span>
                <h2 className="font-serif text-2xl font-normal">{neigh.name}</h2>
              </div>
            </Link>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-semibold text-agency-900 mb-2">
                  {neigh.headline}
                </p>
                <p className="text-xs text-agency-600 leading-relaxed line-clamp-3">
                  {neigh.description}
                </p>

                {/* Vibe Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {neigh.vibe.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-warm text-agency-600 border border-border-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-medium">
                <Link
                  href={`/locations/${neigh.slug}`}
                  className="text-agency-950 hover:text-accent-600 flex items-center transition-colors"
                >
                  <span>Explore District</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  href={`/buy?location=${encodeURIComponent(neigh.name.split(" ")[0])}`}
                  className="text-accent-600 hover:text-accent-700"
                >
                  View Listings &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
