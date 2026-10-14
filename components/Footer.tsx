import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { AGENCY_CONFIG } from "@/config/agency";

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-white border-t border-border-dark pt-16 pb-12 mt-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-border-dark">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.25em] text-white font-medium uppercase">
                {AGENCY_CONFIG.name}
              </span>
              <span className="block text-[11px] tracking-[0.3em] uppercase text-agency-400 font-sans mt-0.5">
                London &bull; Prime Residential
              </span>
            </Link>
            <p className="text-sm text-agency-400 leading-relaxed max-w-md pt-2">
              {AGENCY_CONFIG.description}
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-agency-400">
              <ShieldCheck className="w-4 h-4 text-accent-400" />
              <span>Regulated by RICS &bull; The Property Ombudsman Registered</span>
            </div>
          </div>

          {/* Column 2: Properties */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Properties
            </h3>
            <ul className="space-y-2 text-sm text-agency-300">
              <li>
                <Link href="/buy" className="hover:text-white transition-colors">
                  Prime Sales Portfolio
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-white transition-colors">
                  Executive Lettings
                </Link>
              </li>
              <li>
                <Link href="/buy?propertyType=penthouse" className="hover:text-white transition-colors">
                  Penthouses
                </Link>
              </li>
              <li>
                <Link href="/buy?propertyType=townhouse" className="hover:text-white transition-colors">
                  Townhouses & Villas
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Shortlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Prime Enclaves */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Locations
            </h3>
            <ul className="space-y-2 text-sm text-agency-300">
              <li>
                <Link href="/locations/mayfair" className="hover:text-white transition-colors">
                  Mayfair
                </Link>
              </li>
              <li>
                <Link href="/locations/kensington" className="hover:text-white transition-colors">
                  Kensington & Holland Park
                </Link>
              </li>
              <li>
                <Link href="/locations/chelsea" className="hover:text-white transition-colors">
                  Chelsea
                </Link>
              </li>
              <li>
                <Link href="/locations/belgravia" className="hover:text-white transition-colors">
                  Belgravia
                </Link>
              </li>
              <li>
                <Link href="/locations/marylebone" className="hover:text-white transition-colors">
                  Marylebone
                </Link>
              </li>
              <li>
                <Link href="/locations/richmond" className="hover:text-white transition-colors">
                  Richmond upon Thames
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Advisory & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              Private Office
            </h3>
            <ul className="space-y-2.5 text-sm text-agency-300">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-accent-400 shrink-0 mt-0.5" />
                <span>
                  {AGENCY_CONFIG.address.line1}, {AGENCY_CONFIG.address.line2},{" "}
                  {AGENCY_CONFIG.address.city} {AGENCY_CONFIG.address.postalCode}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-accent-400 shrink-0" />
                <a
                  href={`tel:${AGENCY_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {AGENCY_CONFIG.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-accent-400 shrink-0" />
                <a
                  href={`mailto:${AGENCY_CONFIG.contact.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {AGENCY_CONFIG.contact.email}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/sell"
                  className="inline-flex items-center text-xs tracking-wider uppercase font-medium text-accent-300 hover:text-white"
                >
                  <span>Request Private Valuation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-agency-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {AGENCY_CONFIG.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              About the Firm
            </Link>
            <Link href="/sell" className="hover:text-white transition-colors">
              Sell with Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy & Cookies
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Business
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
