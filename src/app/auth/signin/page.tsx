import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata: Metadata = {
  title: "Private Client Portal | AURA Real Estate",
  description:
    "Secure passwordless access to your saved residences, viewing appointments, and private real estate portfolio.",
};

export default function SignInPage() {
  return (
    <main id="main-content" className="min-h-screen w-full bg-[#FFFFFF] text-[#121312]">
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center p-12 text-center font-mono text-xs text-[#78542E] bg-[#FBFBF9]">
            Loading secure client authentication portal...
          </div>
        }
      >
        <AuthFlow />
      </Suspense>
    </main>
  );
}
