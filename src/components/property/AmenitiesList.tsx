"use client";

import React from "react";
import { Amenities } from "@/types/property";

export interface AmenitiesListProps {
  amenities: Amenities;
  className?: string;
}

export function AmenitiesList({ amenities, className = "" }: AmenitiesListProps) {
  const categories = [
    {
      title: "Interior Architecture",
      icon: (
        <svg className="w-5 h-5 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      items: amenities?.interior || [],
    },
    {
      title: "Outdoor & Grounds",
      icon: (
        <svg className="w-5 h-5 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
      items: amenities?.outdoor || [],
    },
    {
      title: "Building & Services",
      icon: (
        <svg className="w-5 h-5 text-[#78542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      items: amenities?.building || [],
    },
  ];

  return (
    <section className={`w-full ${className}`} aria-labelledby="amenities-heading">
      <div className="border-b border-[#E6E4DE] pb-4 mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#78542E]">
          Features & Specifications
        </span>
        <h2 id="amenities-heading" className="font-serif text-2xl lg:text-3xl font-normal text-[#121312] mt-1">
          Curated Amenities & Architectural Highlights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div
            key={category.title}
            className="bg-[#FBFBF9] border border-[#E6E4DE] rounded-xs p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-[#E6E4DE]">
                {category.icon}
                <h3 className="font-serif text-lg text-[#121312] font-medium">
                  {category.title}
                </h3>
              </div>

              {category.items.length > 0 ? (
                <ul className="mt-4 space-y-2.5" role="list">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-[#4A4C48]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#78542E] mt-1.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-xs font-mono text-[#8E8A80]">
                  Specific features available upon request.
                </p>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E6E4DE]/60 text-[10px] font-mono text-[#8E8A80] uppercase tracking-wider">
              {category.items.length} verified attributes
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
