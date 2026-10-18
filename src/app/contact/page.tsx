import React from "react";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { ContactForm } from "@/components/inquiry/ContactForm";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";

export const metadata: Metadata = {
  title: "Contact — Global Offices & Private Client Desks",
  description:
    "Connect with AURA Real Estate advisory desks in London Mayfair, New York Fifth Avenue, and Zurich Bahnhofstrasse for confidential acquisitions, lettings, and valuation.",
};

const OFFICES = [
  {
    city: "London",
    role: "Global Headquarters & European Acquisitions",
    district: "Mayfair",
    address: "14 Berkeley Square, Mayfair, London W1J 6BD",
    telephone: "+44 (0)20 7946 0880",
    email: "london@aurarealestate.com",
    hours: "Monday – Friday, 08:30 – 19:00 GMT",
    desc: "Direct advisory for prime central London, heritage estates in the Home Counties, and cross-border European capital placement.",
  },
  {
    city: "New York",
    role: "Americas Private Office",
    district: "Fifth Avenue / Manhattan",
    address: "767 Fifth Avenue, New York, NY 10153",
    telephone: "+1 (212) 555-0180",
    email: "newyork@aurarealestate.com",
    hours: "Monday – Friday, 09:00 – 18:00 EST",
    desc: "Specializing in prime Manhattan penthouses, historic cast-iron lofts in SoHo and Tribeca, and Hudson Valley architectural compounds.",
  },
  {
    city: "Zurich",
    role: "Alpine & Private Wealth Advisory",
    district: "Bahnhofstrasse",
    address: "Bahnhofstrasse 45, 8001 Zürich, Switzerland",
    telephone: "+41 44 211 0180",
    email: "zurich@aurarealestate.com",
    hours: "Monday – Friday, 08:30 – 18:30 CET",
    desc: "Dedicated to private banking clientele, lakefront Zurich villas, Engadin chalets, and family office real estate portfolio allocation.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF9] text-[#121312]">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-gradient-to-b from-[#F3F1EC]/70 via-[#F8F6F2]/50 to-[#FBFBF9] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              {/* Left Column — Headline, Description & Direct Actions */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-[#78542E]" aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#78542E] font-medium">
                    Global Presence • Centralized Offices
                  </p>
                </div>

                <h1 className="font-serif text-page-title font-normal tracking-tight-editorial text-[#121312] mb-6">
                  Engage With Our Private Client Advisory Desks.
                </h1>

                <p className="font-sans text-body-large text-[#4A4C48] leading-relaxed max-w-lead mb-8 sm:mb-10">
                  Whether inquiring regarding an off-market acquisition, seeking confidential valuation for an architectural estate, or coordinating executive leasing, our partners are at your disposal across London, New York, and Zurich.
                </p>

                {/* Primary & Secondary Contact CTAs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
                  <a
                    href="#inquiry-form"
                    className="inline-flex items-center justify-center h-12 px-7 bg-[#121312] hover:bg-[#282A27] text-[#FBFBF9] font-sans text-xs uppercase tracking-[0.14em] font-medium rounded-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
                  >
                    Transmit Client Inquiry
                  </a>
                  <a
                    href="#office-directory"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#121312] hover:text-[#78542E] transition-colors font-medium py-2 focus-visible:outline-none focus-visible:underline group"
                  >
                    <span>View Global Offices</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                  </a>
                </div>

                {/* Editorial Micro-Trust Indicators */}
                <div className="pt-6 border-t border-[#E6E4DE] grid grid-cols-3 gap-2.5 sm:gap-6 text-left">
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#121312] font-normal">3 Cities</p>
                    <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78542E] mt-0.5">London • NY • Zurich</p>
                  </div>
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#121312] font-normal">&lt; 24h</p>
                    <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78542E] mt-0.5">Senior Partner SLA</p>
                  </div>
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#121312] font-normal">100%</p>
                    <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78542E] mt-0.5">Confidential Advisory</p>
                  </div>
                </div>
              </div>

              {/* Right Column — Architectural Hero Image */}
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
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
                      alt="Prime modern private client residence and architectural pavilion with ambient evening reflection, representing AURA Real Estate advisory offices"
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
                        Private Client Reception • Advisory
                      </span>
                    </div>

                    {/* Subtle Editorial Caption Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-[#FBFBF9]">
                      <p className="font-serif text-lg sm:text-xl font-normal leading-snug drop-shadow-sm">
                        Prime Architectural Pavilion
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#E6E4DE] mt-1 opacity-90">
                        Private Client Reception &amp; Fiduciary Desks
                      </p>
                    </div>
                  </div>

                  <figcaption className="sr-only">
                    Prime modern private client residence and architectural pavilion with ambient evening reflection, representing AURA Real Estate advisory offices.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

      {/* Centralized Office Cards */}
      <section id="office-directory" className="scroll-mt-24 lg:scroll-mt-32 py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E6E4DE] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] block mb-2 font-medium">
              Agency Directory
            </span>
            <h2 className="font-serif text-section-title text-[#121312] font-normal tracking-tight-editorial">
              Three Global Financial &amp; Architectural Capitals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {OFFICES.map((office) => (
              <div
                key={office.city}
                className="p-8 bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs space-y-6 flex flex-col justify-between hover:border-[#121312] transition-colors"
              >
                <div className="space-y-4">
                  <div className="border-b border-[#E6E4DE] pb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#78542E] block mb-1">
                      {office.role}
                    </span>
                    <h3 className="font-serif text-section-h3 text-[#121312] font-normal">
                      {office.city}
                    </h3>
                    <p className="font-sans text-xs text-[#63655E] mt-0.5">
                      {office.district}
                    </p>
                  </div>

                  <p className="font-sans text-body-small text-[#4A4C48] leading-relaxed">
                    {office.desc}
                  </p>

                  <div className="space-y-2 pt-2 text-xs font-sans text-[#121312]">
                    <p className="font-medium text-[#121312]">{office.address}</p>
                    <p className="text-[#63655E] font-mono text-[11px]">{office.hours}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E6E4DE] space-y-1.5 font-mono text-xs">
                  <a
                    href={`tel:${office.telephone.replace(/[^+\d]/g, "")}`}
                    className="block text-[#121312] hover:text-[#78542E] transition-colors"
                  >
                    Tel: {office.telephone}
                  </a>
                  <a
                    href={`mailto:${office.email}`}
                    className="block text-[#78542E] hover:text-[#121312] transition-colors truncate"
                  >
                    {office.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main General Inquiry Form Section */}
      <section id="inquiry-form" className="scroll-mt-24 lg:scroll-mt-32 py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBFBF9] border-b border-[#E6E4DE]">
        <div className="max-w-4xl mx-auto">
          <ContactForm />

          {/* Department Directory & Media Inquiries */}
          <div className="mt-14 p-8 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs">
            <h3 className="font-mono text-eyebrow-label uppercase tracking-[0.2em] text-[#78542E] mb-4 font-medium">
              Specialized Departmental Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#121312] font-semibold block">Private Acquisitions</span>
                <p className="text-[#63655E] font-sans text-xs mb-1">Sale portfolio &amp; off-market search</p>
                <a href="mailto:acquisitions@aurarealestate.com" className="text-[#78542E] hover:underline">
                  acquisitions@aurarealestate.com
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[#121312] font-semibold block">Turnkey Luxury Lettings</span>
                <p className="text-[#63655E] font-sans text-xs mb-1">Corporate &amp; executive tenancy</p>
                <a href="mailto:lettings@aurarealestate.com" className="text-[#78542E] hover:underline">
                  lettings@aurarealestate.com
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[#121312] font-semibold block">Press, Editorial &amp; Media</span>
                <p className="text-[#63655E] font-sans text-xs mb-1">Monograph loans &amp; publications</p>
                <a href="mailto:press@aurarealestate.com" className="text-[#78542E] hover:underline">
                  press@aurarealestate.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
