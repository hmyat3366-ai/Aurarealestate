"use client";

import React from "react";
import { Agent } from "@/types/property";

export interface AgentCardProps {
  agent: Agent;
  propertyTitle?: string;
  onInquire?: () => void;
  className?: string;
}

export function AgentCard({
  agent,
  propertyTitle,
  onInquire,
  className = "",
}: AgentCardProps) {
  const cleanPhone = agent.phone.replace(/[^0-9+]/g, "");

  return (
    <div
      className={`bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs p-6 shadow-sm flex flex-col justify-between ${className}`}
      data-testid="listing-agent-card"
    >
      <div>
        {/* Exclusivity Badge */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#E6E4DE]">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#78542E] bg-[#F4EDE2] px-2.5 py-1 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78542E]" aria-hidden="true" />
            Dedicated Listing Advisor
          </span>
          <span className="font-mono text-[10px] text-[#8E8A80] uppercase tracking-widest">
            Exclusive
          </span>
        </div>

        {/* Advisor Profile Header */}
        <div className="mt-5 flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-16 h-16 rounded-full object-cover border border-[#E6E4DE] shrink-0 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-xl font-normal text-[#121312] truncate">
              {agent.name}
            </h3>
            <p className="font-sans text-xs text-[#78542E] font-medium tracking-wide mt-0.5">
              {agent.title}
            </p>
            <p className="font-mono text-[10px] text-[#8E8A80] uppercase tracking-wider mt-1">
              AURA Real Estate Private Portfolio
            </p>
          </div>
        </div>

        {/* Advisor Bio (if provided) */}
        {agent.bio && (
          <p className="mt-4 font-sans text-xs text-[#4A4C48] leading-relaxed line-clamp-3">
            {agent.bio}
          </p>
        )}

        {/* Direct Contact Links */}
        <div className="mt-5 space-y-2.5 pt-4 border-t border-[#E6E4DE]">
          {/* Phone */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-3 text-xs font-mono text-[#121312] hover:text-[#78542E] transition-colors group p-1.5 -mx-1.5 rounded-xs hover:bg-[#FBFBF9]"
            aria-label={`Call ${agent.name} at ${agent.phone}`}
          >
            <span className="w-7 h-7 rounded-full bg-[#F3F1EC] group-hover:bg-[#F4EDE2] flex items-center justify-center text-[#78542E] shrink-0 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </span>
            <span className="truncate">{agent.phone}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${agent.email}?subject=${encodeURIComponent(
              propertyTitle ? `Inquiry regarding ${propertyTitle}` : "Property Inquiry via AURA Real Estate"
            )}`}
            className="flex items-center gap-3 text-xs font-mono text-[#121312] hover:text-[#78542E] transition-colors group p-1.5 -mx-1.5 rounded-xs hover:bg-[#FBFBF9]"
            aria-label={`Email ${agent.name} at ${agent.email}`}
          >
            <span className="w-7 h-7 rounded-full bg-[#F3F1EC] group-hover:bg-[#F4EDE2] flex items-center justify-center text-[#78542E] shrink-0 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <span className="truncate">{agent.email}</span>
          </a>
        </div>
      </div>

      {/* "Ask a Question" Trigger Button */}
      {onInquire && (
        <div className="mt-5 pt-4 border-t border-[#E6E4DE]">
          <button
            type="button"
            onClick={onInquire}
            className="w-full h-11 px-4 bg-[#FBFBF9] hover:bg-[#F3F1EC] text-[#121312] border border-[#E6E4DE] rounded-xs font-sans text-xs uppercase tracking-[0.1em] font-medium transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312]"
          >
            Ask a Question
          </button>
        </div>
      )}
    </div>
  );
}
