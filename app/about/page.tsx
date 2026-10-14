import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Users, Scale, ArrowRight, Building } from "lucide-react";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata = {
  title: "About Vane & Sterling | Prime London Real Estate Firm",
  description:
    "Learn about Vane & Sterling, an independent, partner-led real estate agency specializing in Prime Central London residential property and client fiduciary representation.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 sm:space-y-28 py-10 sm:py-16">
      {/* Hero Narrative */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
            About the Firm
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-agency-950 font-normal leading-tight">
            Curators of Prime & Exceptional Residential Property
          </h1>
          <p className="text-base sm:text-xl text-agency-600 font-light leading-relaxed">
            Vane & Sterling was established on a single principle: providing discerning private clients, family trusts, and property owners with thoughtful, transparent, and partner-led residential advisory.
          </p>
        </div>
      </section>

      {/* Flagship Editorial Image */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[360px] sm:h-[500px] rounded-xl overflow-hidden border border-border-subtle shadow-premium">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
            alt="Vane & Sterling Berkeley Square Office Library"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white text-xs text-agency-200">
            Mayfair Private Office &bull; 42 Berkeley Square
          </div>
        </div>
      </section>

      {/* Core Values & Working Approach */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-lg bg-surface-canvas border border-border-subtle shadow-subtle space-y-3">
            <Scale className="w-6 h-6 text-accent-600" />
            <h3 className="font-serif text-2xl font-normal text-agency-950">
              Fiduciary Integrity
            </h3>
            <p className="text-sm text-agency-600 leading-relaxed">
              We operate exclusively under formal agency mandates. We do not participate in multi-agency bidding games or publish unverified inventory. Our advice is grounded in rigorous market data and client duty.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-surface-canvas border border-border-subtle shadow-subtle space-y-3">
            <Users className="w-6 h-6 text-accent-600" />
            <h3 className="font-serif text-2xl font-normal text-agency-950">
              Partner-Led Service
            </h3>
            <p className="text-sm text-agency-600 leading-relaxed">
              Every instruction—whether the sale of a historic townhouse or an executive long-term tenancy—is directed personally by an equity partner, ensuring continuity, discretion, and seniority.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-surface-canvas border border-border-subtle shadow-subtle space-y-3">
            <ShieldCheck className="w-6 h-6 text-accent-600" />
            <h3 className="font-serif text-2xl font-normal text-agency-950">
              Regulatory Standing
            </h3>
            <p className="text-sm text-agency-600 leading-relaxed">
              As an agency holding RICS regulation and registration with The Property Ombudsman, we adhere to strict anti-money laundering regulations and maintain separate audited client money protection.
            </p>
          </div>
        </div>
      </section>

      {/* Areas Served & Directory */}
      <section className="bg-surface-canvas py-16 sm:py-24 border-y border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-accent-600">
                Coverage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-agency-950 font-normal leading-tight">
                Prime Central London & Selected European Enclaves
              </h2>
              <p className="text-sm sm:text-base text-agency-600 leading-relaxed">
                Our core residential focus centers upon London’s Royal Boroughs and prime central postcodes:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-agency-800 font-medium">
                <div className="p-3 bg-surface-warm rounded border border-border-subtle">&bull; Mayfair (W1K, W1J)</div>
                <div className="p-3 bg-surface-warm rounded border border-border-subtle">&bull; Kensington & Holland Park (W8, W14)</div>
                <div className="p-3 bg-surface-warm rounded border border-border-subtle">&bull; Chelsea (SW3, SW10)</div>
                <div className="p-3 bg-surface-warm rounded border border-border-subtle">&bull; Belgravia & Knightsbridge (SW1X, SW1W)</div>
                <div className="p-3 bg-surface-warm rounded border border-border-subtle">&bull; Marylebone (W1G, W1U)</div>
                <div className="p-3 bg-surface-warm rounded border border-border-subtle">&bull; Richmond upon Thames (TW10)</div>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-surface-warm border border-border-strong space-y-4">
              <h3 className="font-serif text-2xl font-normal text-agency-950">
                Discreet Property Acquisitions
              </h3>
              <p className="text-xs sm:text-sm text-agency-600 leading-relaxed">
                In addition to our public sales and lettings portfolio, Vane & Sterling manages private off-market mandates for properties whose owners require complete confidentiality.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-accent-600 hover:text-accent-700"
                >
                  <span>Submit Confidential Search Brief</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
        <h2 className="font-serif text-3xl sm:text-4xl text-agency-950 font-normal">
          Speak with a Partner
        </h2>
        <p className="text-sm text-agency-600 mt-2 leading-relaxed">
          Whether you are evaluating the sale of a prime residence, seeking an executive tenancy, or requesting off-market guidance, our partners are at your service.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 rounded transition-colors"
          >
            Contact Private Office
          </Link>
          <Link
            href="/sell"
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-agency-900 bg-surface-canvas border border-border-strong hover:bg-agency-100 rounded transition-colors"
          >
            Sell with Us
          </Link>
        </div>
      </section>
    </div>
  );
}
