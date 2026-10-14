import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-accent-600 block mb-3 font-sans">
        404 &bull; Page Not Found
      </span>

      <h1 className="font-serif text-4xl sm:text-6xl text-agency-950 font-normal mb-4">
        Residence or Page Unavailable
      </h1>

      <p className="text-sm sm:text-base text-agency-600 max-w-md mx-auto leading-relaxed mb-8">
        The instruction you are looking for may have concluded completion, been withdrawn, or the URL address was entered incorrectly.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-agency-950 hover:bg-agency-900 rounded transition-colors flex items-center justify-center"
        >
          <Home className="w-3.5 h-3.5 mr-2" />
          <span>Return to Homepage</span>
        </Link>

        <Link
          href="/buy"
          className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider text-agency-900 bg-surface-canvas border border-border-strong hover:bg-agency-100 rounded transition-colors flex items-center justify-center"
        >
          <Search className="w-3.5 h-3.5 mr-2" />
          <span>Browse Available Portfolio</span>
        </Link>
      </div>
    </div>
  );
}
