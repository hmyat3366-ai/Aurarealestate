"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AuraLogo, AuraMonogram } from "@/components/brand";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArchitecturalImage } from "@/components/ui/ArchitecturalImage";
import { sanitizeReturnUrl } from "@/lib/auth-utils";

type AuthStep = "EMAIL" | "OTP" | "PROFILE" | "SUCCESS";
type AuthMode = "signin" | "signup";

export interface AuthFlowProps {
  initialReturnUrl?: string;
  defaultEmail?: string;
  defaultMode?: AuthMode;
}

export function maskEmail(email: string): string {
  if (!email || typeof email !== "string" || !email.includes("@")) return email || "";
  const lastAt = email.lastIndexOf("@");
  const localPart = email.slice(0, lastAt);
  const domain = email.slice(lastAt + 1);
  if (!localPart || !domain) return email;

  const chars = Array.from(localPart);
  if (chars.length <= 2) {
    return `${chars[0]}*@${domain}`;
  }
  const first = chars[0];
  const last = chars[chars.length - 1];
  return `${first}***${last}@${domain}`;
}

export function AuthFlow({
  initialReturnUrl,
  defaultEmail = "",
  defaultMode,
}: AuthFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, isAuthenticated, sendOtp, verifyOtp, completeRegistration } = useAuth();

  // Resolve target return URL
  const queryReturnUrl = searchParams?.get("returnUrl");
  const returnUrl = sanitizeReturnUrl(queryReturnUrl || initialReturnUrl, "/account");

  // Authentication mode: Sign In vs Create Account (both leverage the unified passwordless OTP flow)
  const queryMode = searchParams?.get("mode") as AuthMode | null;
  const isSignupPath = pathname?.includes("signup");
  const initialMode: AuthMode =
    defaultMode || (isSignupPath || queryMode === "signup" ? "signup" : "signin");
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

  // Step state
  const queryEmail = searchParams?.get("email") || "";
  const [step, setStep] = useState<AuthStep>("EMAIL");
  const [email, setEmail] = useState(defaultEmail || queryEmail);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [devOtpCode, setDevOtpCode] = useState("");

  // Loading & error state
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [nameError, setNameError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // Timers: 5-min OTP expiry (300s) and 60s resend cooldown
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);

  // Input refs for 6 OTP boxes
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // If already authenticated and not currently finishing registration, redirect to returnUrl
  useEffect(() => {
    if (isAuthenticated && user && step !== "PROFILE" && step !== "SUCCESS") {
      router.push(returnUrl);
    }
  }, [isAuthenticated, user, step, returnUrl, router]);

  // Expiry countdown timer (5 minutes)
  useEffect(() => {
    if (step !== "OTP") return;
    if (expirySeconds <= 0) return;

    const timer = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpError("This verification code has expired. Please request a new code.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  // Resend cooldown timer (60 seconds)
  useEffect(() => {
    if (step !== "OTP") return;
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, cooldownSeconds]);

  // Focus first OTP input on step change
  useEffect(() => {
    if (step === "OTP") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Helper format seconds to MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // =========================================================================
  // =========================================================================
  // STEP A: SEND OTP (Unified Passwordless Entry)
  // =========================================================================
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setEmailError("");
    setGeneralError("");

    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(trimmed);
    setIsLoading(false);

    if (!res.success) {
      if (res.cooldownSeconds) {
        setCooldownSeconds(res.cooldownSeconds);
      }
      setGeneralError(res.error || "Unable to dispatch code. Please try again.");
      return;
    }

    // Anti-enumeration: transition to OTP screen
    if (res.devCode) {
      setDevOtpCode(res.devCode);
    }
    setOtpCode(["", "", "", "", "", ""]);
    setOtpError("");
    setRemainingAttempts(null);
    setExpirySeconds(300); // 5 minutes
    setCooldownSeconds(res.cooldownSeconds || 60);
    setStep("OTP");
  };

  // =========================================================================
  // STEP B: VERIFY OTP (6-Digit Numeric Verification)
  // =========================================================================
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const newCode = [...otpCode];

    // Handle full 6-digit paste or mobile autofill
    if (cleaned.length === 6) {
      const digits = cleaned.split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = digits[i] || "";
      }
      setOtpCode(newCode);
      otpInputRefs.current[5]?.focus();
      return;
    }

    // If multi-character: either user typed over an existing character or pasted multiple
    if (cleaned.length > 1) {
      if (cleaned.length === 2 && otpCode[index]) {
        // User typed replacement digit into an already populated input
        const newChar = cleaned.replace(otpCode[index], "")[0] || cleaned.slice(-1);
        newCode[index] = newChar;
        setOtpCode(newCode);
        if (index < 5) {
          otpInputRefs.current[index + 1]?.focus();
        }
        return;
      }

      // Pasted partial digits starting from current index
      const digits = cleaned.split("");
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        newCode[index + i] = digits[i];
      }
      setOtpCode(newCode);
      const nextFocus = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newCode[index] = cleaned;
    setOtpCode(newCode);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newCode = [...otpCode];
    if (pasted.length >= 6) {
      const digits = pasted.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = digits[i] || "";
      }
      setOtpCode(newCode);
      otpInputRefs.current[5]?.focus();
    } else {
      // Pasted fewer than 6 digits: fill starting from active focused input
      const activeIdx = otpInputRefs.current.findIndex((el) => el === document.activeElement);
      const startIdx = activeIdx >= 0 ? activeIdx : 0;
      const digits = pasted.split("");
      for (let i = 0; i < digits.length && startIdx + i < 6; i++) {
        newCode[startIdx + i] = digits[i];
      }
      setOtpCode(newCode);
      const nextFocus = Math.min(startIdx + digits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpCode[index] && index > 0) {
        e.preventDefault();
        const newCode = [...otpCode];
        newCode[index - 1] = "";
        setOtpCode(newCode);
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setOtpError("");
    setGeneralError("");

    const fullCode = otpCode.join("").trim();
    if (fullCode.length !== 6) {
      setOtpError("Please enter all 6 digits of your verification code.");
      return;
    }

    if (expirySeconds <= 0) {
      setOtpError("This verification code has expired. Please request a new code.");
      return;
    }

    setIsLoading(true);
    const res = await verifyOtp(email.trim(), fullCode);
    setIsLoading(false);

    if (!res.success) {
      setOtpError(res.error || "Invalid verification code.");
      if (res.remainingAttempts !== undefined) {
        setRemainingAttempts(res.remainingAttempts);
      }
      return;
    }

    if (res.isNewUser) {
      // Step D: New account profile-completion step
      setRegistrationToken(res.registrationToken || "");
      try {
        const pendingStr = localStorage.getItem("aura_pending_viewing");
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
          if (pending?.fullName && !fullName) setFullName(pending.fullName);
          if (pending?.phone && !phone) setPhone(pending.phone);
        }
      } catch {
        // Ignore
      }
      setStep("PROFILE");
    } else {
      // Step C: Existing user direct session established
      const intent = searchParams?.get("intent");
      const propId = searchParams?.get("propertyId");
      if (intent === "save" && propId) {
        try {
          await fetch("/api/account/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ propertyId: propId }),
          });
          const stored = localStorage.getItem("aura_real_estate_favorites");
          const list = stored ? JSON.parse(stored) : [];
          if (Array.isArray(list) && !list.includes(propId)) {
            list.push(propId);
            localStorage.setItem("aura_real_estate_favorites", JSON.stringify(list));
          }
          localStorage.removeItem("aura_pending_save");
        } catch {
          // Handled by sync
        }
      }

      if (intent === "viewing") {
        try {
          const pendingStr = localStorage.getItem("aura_pending_viewing");
          if (pendingStr) {
            const pending = JSON.parse(pendingStr);
            if (pending && pending.propertyId) {
              const bookingRes = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  propertyId: pending.propertyId,
                  fullName: user?.fullName || fullName || pending.fullName || "Private Client",
                  email: user?.email || email.trim() || pending.email,
                  phone: user?.phone || phone.trim() || pending.phone || "+44 20 7000 0000",
                  tourType: pending.tourType || "in-person",
                  preferredDate: pending.preferredDate,
                  preferredTime: pending.preferredTime || "afternoon",
                  notes: pending.notes,
                }),
              });
              if (bookingRes.ok) {
                const bookingData = await bookingRes.json();
                if (bookingData?.referenceCode) {
                  localStorage.setItem("aura_last_viewing_ref", bookingData.referenceCode);
                  localStorage.setItem(
                    "aura_last_viewing_data",
                    JSON.stringify({
                      propertyId: pending.propertyId,
                      referenceCode: bookingData.referenceCode,
                      tourType: pending.tourType,
                      preferredDate: pending.preferredDate,
                      preferredTime: pending.preferredTime,
                      status: "pending_confirmation",
                    })
                  );
                }
              }
            }
          }
        } catch {
          // Handled gracefully on return
        }
      }

      setStep("SUCCESS");
      setTimeout(() => {
        router.push(returnUrl);
      }, 700);
    }
  };

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || isLoading) return;
    setOtpError("");
    setGeneralError("");
    setIsLoading(true);

    const res = await sendOtp(email.trim());
    setIsLoading(false);

    if (!res.success) {
      setOtpError(res.error || "Unable to resend code.");
      if (res.cooldownSeconds) setCooldownSeconds(res.cooldownSeconds);
      return;
    }

    if (res.devCode) {
      setDevOtpCode(res.devCode);
    }
    setOtpCode(["", "", "", "", "", ""]);
    setExpirySeconds(300);
    setCooldownSeconds(res.cooldownSeconds || 60);
    setRemainingAttempts(null);
    otpInputRefs.current[0]?.focus();
  };

  // =========================================================================
  // STEP D: COMPLETE PROFILE (New User)
  // =========================================================================
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setNameError("");
    setGeneralError("");

    if (!fullName || fullName.trim().length < 2) {
      setNameError("Full name must be at least 2 characters.");
      return;
    }

    setIsLoading(true);
    const res = await completeRegistration(
      registrationToken,
      fullName.trim(),
      phone.trim() || undefined
    );
    setIsLoading(false);

    if (!res.success) {
      setGeneralError(res.error || "Failed to complete profile. Please try again.");
      return;
    }

    const intent = searchParams?.get("intent");
    const propId = searchParams?.get("propertyId");
    if (intent === "save" && propId) {
      try {
        await fetch("/api/account/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: propId }),
        });
        const stored = localStorage.getItem("aura_real_estate_favorites");
        const list = stored ? JSON.parse(stored) : [];
        if (Array.isArray(list) && !list.includes(propId)) {
          list.push(propId);
          localStorage.setItem("aura_real_estate_favorites", JSON.stringify(list));
        }
        localStorage.removeItem("aura_pending_save");
      } catch {
        // Handled by sync
      }
    }

    if (intent === "viewing") {
      try {
        const pendingStr = localStorage.getItem("aura_pending_viewing");
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
          if (pending && pending.propertyId) {
            const bookingRes = await fetch("/api/inquiries", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                propertyId: pending.propertyId,
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim() || "+44 20 7000 0000",
                tourType: pending.tourType || "in-person",
                preferredDate: pending.preferredDate,
                preferredTime: pending.preferredTime || "afternoon",
                notes: pending.notes,
              }),
            });
            if (bookingRes.ok) {
              const bookingData = await bookingRes.json();
              if (bookingData?.referenceCode) {
                localStorage.setItem("aura_last_viewing_ref", bookingData.referenceCode);
                localStorage.setItem(
                  "aura_last_viewing_data",
                  JSON.stringify({
                    propertyId: pending.propertyId,
                    referenceCode: bookingData.referenceCode,
                    tourType: pending.tourType,
                    preferredDate: pending.preferredDate,
                    preferredTime: pending.preferredTime,
                    status: "pending_confirmation",
                  })
                );
              }
            }
          }
        }
      } catch {
        // Handled gracefully on return
      }
    }

    setStep("SUCCESS");
    setTimeout(() => {
      router.push(returnUrl);
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFFFFF] text-[#121312] selection:bg-[#121312] selection:text-[#FBFBF9]">
      {/* =================================================================== */}
      {/* LEFT PANEL — Architectural Brand Experience (approx 45–50% desktop)  */}
      {/* =================================================================== */}
      <aside
        aria-label="AURA Architectural Brand Experience"
        className="hidden md:flex md:w-[42%] lg:w-[46%] xl:w-[48%] relative flex-col justify-between overflow-hidden bg-[#121312] min-h-screen sticky top-0 h-screen select-none shrink-0"
      >
        {/* Full-bleed Architectural Photograph with Graceful Offline/SVG Fallback */}
        <ArchitecturalImage
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="AURA Architectural Residence — Mayfair Penthouse with dramatic natural light"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Subtle Dark Vignette Overlay preserving high-contrast readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#121312]/90 via-[#121312]/40 to-[#121312]/60 mix-blend-multiply"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

        {/* Top: AURA Real Estate Brand Logo */}
        <div className="relative z-10 p-8 sm:p-10 lg:p-12 xl:p-16">
          <Link
            href="/"
            aria-label="AURA Real Estate Homepage"
            className="inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FBFBF9] rounded-xs transition-opacity hover:opacity-90"
          >
            <AuraLogo variant="horizontal" theme="dark" />
          </Link>
        </div>

        {/* Bottom: Editorial Headline & Supporting Brand Statement */}
        <div className="relative z-10 p-8 sm:p-10 lg:p-12 xl:p-16 mt-auto">
          <div className="w-10 h-[1.5px] bg-[#78542E] mb-6" aria-hidden="true" />
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-[#FBFBF9] leading-[1.18] tracking-tight max-w-lg">
            Find a Place Worth Calling Yours.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#D5D1C7] mt-4 max-w-md leading-relaxed font-light">
            Discover distinctive properties and make your next move with AURA.
          </p>

          <div className="mt-8 pt-6 border-t border-[#FBFBF9]/15 flex items-center justify-between text-[11px] font-mono text-[#A8A49A]">
            <span>London • New York • Zürich</span>
            <span className="uppercase tracking-widest text-[#C5A880]">Private Portfolio</span>
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MOBILE HEADER BANNER (Stacked intentionally on viewports < 768px)   */}
      {/* =================================================================== */}
      <div className="md:hidden relative w-full h-36 sm:h-44 overflow-hidden bg-[#121312] shrink-0 flex flex-col justify-between p-4 sm:p-6 select-none">
        <ArchitecturalImage
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="AURA Architectural Residence"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#121312]/95 via-[#121312]/60 to-[#121312]/40"
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" aria-label="AURA Real Estate Homepage">
            <AuraLogo variant="horizontal" theme="dark" />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#C5A880]">
            Private Client
          </span>
        </div>
        <div className="relative z-10">
          <p className="font-serif text-base sm:text-lg text-[#FBFBF9] leading-snug">
            Find a Place Worth Calling Yours.
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT PANEL — Authentication Form (approx 50–55% desktop)          */}
      {/* =================================================================== */}
      <section
        aria-label="Client Authentication Portal"
        className="w-full md:w-[58%] lg:w-[54%] xl:w-[52%] flex flex-col justify-between min-h-screen bg-[#FFFFFF] p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto"
      >
        {/* Minimal Top Utility Area with "Back to Website" Link */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E6E4DE]/60">
          <Link
            href={returnUrl && returnUrl !== "/account" ? returnUrl : "/"}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#63655E] hover:text-[#121312] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121312] rounded-xs py-1 px-1.5"
            aria-label="Back to Website"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Website</span>
          </Link>

          {/* Discreet Mobile Monogram */}
          <div className="md:hidden">
            <Link href="/" aria-label="AURA Real Estate Homepage">
              <AuraMonogram size={30} theme="bronze" />
            </Link>
          </div>
        </div>

        {/* Centered Form Core Container */}
        <div className="w-full max-w-md mx-auto my-auto py-4 sm:py-6">
          {/* Brand Eyebrow & Headings */}
          <div className="text-center sm:text-left mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F4EDE2] border border-[#D5C2A5] mb-3 text-[10px] font-mono uppercase tracking-wider text-[#78542E] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78542E]" aria-hidden="true" />
              <span>Private Client Portal</span>
            </div>

            <h2 className="text-xs font-mono uppercase tracking-[0.16em] text-[#78542E] mb-2 font-medium">
              {step === "EMAIL" && (authMode === "signup" ? "New Client Registration" : "Private Client Sign In")}
              {step === "OTP" && "Enter Verification Code"}
              {step === "PROFILE" && "Private Client Onboarding"}
              {step === "SUCCESS" && "Authentication Complete"}
            </h2>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-normal tracking-tight text-[#121312] leading-tight">
              {step === "EMAIL" && "Welcome to AURA"}
              {step === "OTP" && "Check Your Email"}
              {step === "PROFILE" && "Complete Your Profile"}
              {step === "SUCCESS" && "Welcome to AURA"}
            </h1>

            <p className="font-sans text-sm text-[#63655E] mt-3 leading-relaxed">
              {step === "EMAIL" && (
                <>
                  Sign in or create your account to keep your saved properties and viewing history together.
                  <span className="block mt-1 text-xs text-[#8E8A80]">
                    Passwordless authentication for your private viewing portfolio.
                  </span>
                </>
              )}
              {step === "OTP" &&
                `A 6-digit authentication code was sent to ${email}.`}
              {step === "PROFILE" &&
                "Please confirm your name to complete your private client registration and merge your saved residences."}
              {step === "SUCCESS" &&
                "Authentication verified. Establishing your secure session..."}
            </p>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div
              role="alert"
              className="mb-6 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xs text-xs font-sans text-[#991B1B]"
            >
              {generalError}
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP A: ENTER EMAIL                                               */}
          {/* ================================================================= */}
          {step === "EMAIL" && (
            <div>
              {/* Restrained Mode Switcher: Sign In vs Create Account */}
              <div
                className="flex border-b border-[#E6E4DE] mb-6"
                role="tablist"
                aria-label="Authentication mode"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-signin"
                  aria-controls="panel-auth"
                  aria-selected={authMode === "signin"}
                  onClick={() => setAuthMode("signin")}
                  className={`pb-3 text-xs uppercase tracking-[0.14em] font-medium transition-colors border-b-2 mr-6 ${
                    authMode === "signin"
                      ? "border-[#121312] text-[#121312]"
                      : "border-transparent text-[#63655E] hover:text-[#121312]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-signup"
                  aria-controls="panel-auth"
                  aria-selected={authMode === "signup"}
                  onClick={() => setAuthMode("signup")}
                  className={`pb-3 text-xs uppercase tracking-[0.14em] font-medium transition-colors border-b-2 ${
                    authMode === "signup"
                      ? "border-[#121312] text-[#121312]"
                      : "border-transparent text-[#63655E] hover:text-[#121312]"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form
                id="panel-auth"
                onSubmit={handleEmailSubmit}
                className="space-y-6"
                noValidate
              >
                <Input
                  label="Email Address"
                  type="email"
                  id="auth-email-input"
                  name="email"
                  autoComplete="email"
                  placeholder="e.g. sterling@aurarealestate.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  error={emailError}
                  isRequired
                  autoFocus
                />

                <div className="text-[11px] font-sans text-[#8E8A80] leading-relaxed">
                  We will dispatch a secure 6-digit code. No passwords required. Works for both existing accounts and new client registrations.
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12 uppercase tracking-[0.14em] text-xs font-medium"
                  isLoading={isLoading}
                  loadingText="Dispatching Code..."
                >
                  Continue with Email
                </Button>

                <div className="pt-2 text-center text-xs font-sans text-[#63655E]">
                  {authMode === "signin" ? (
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className="hover:text-[#121312] transition-colors"
                    >
                      New to AURA?{" "}
                      <span className="text-[#78542E] underline underline-offset-2 font-medium">
                        Create an account
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className="hover:text-[#121312] transition-colors"
                    >
                      Already have an account?{" "}
                      <span className="text-[#78542E] underline underline-offset-2 font-medium">
                        Sign in
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP B: 6-DIGIT OTP VERIFICATION                                  */}
          {/* ================================================================= */}
          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
              {/* Prominent Masked Email Banner */}
              <div className="p-3.5 bg-[#F4EDE2] border border-[#D5C2A5] rounded-xs flex items-center justify-between">
                <div className="truncate">
                  <span className="block font-mono text-[10px] uppercase text-[#78542E] font-medium tracking-wider">
                    Verification Code Sent To
                  </span>
                  <span
                    data-testid="masked-email"
                    className="font-mono text-xs font-semibold text-[#121312] tracking-wider truncate block mt-0.5"
                  >
                    {maskEmail(email)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("EMAIL");
                    setOtpError("");
                  }}
                  className="text-xs font-sans text-[#78542E] hover:text-[#121312] underline ml-3 shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Dev Mode Verification Code Banner (Local Testing) */}
              {devOtpCode && (
                <div
                  data-testid="dev-otp-banner"
                  className="p-3 bg-[#FBFBF9] border border-[#78542E]/30 rounded-xs flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#78542E] animate-pulse" aria-hidden="true" />
                    <span className="text-[#78542E] uppercase tracking-wider text-[11px] font-semibold">
                      Dev Code:
                    </span>
                    <span className="text-[#121312] font-bold text-sm tracking-widest">
                      {devOtpCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = devOtpCode.slice(0, 6).split("");
                      setOtpCode(digits);
                      setOtpError("");
                      otpInputRefs.current[5]?.focus();
                    }}
                    className="text-[11px] font-sans font-medium text-[#78542E] hover:text-[#121312] underline uppercase tracking-wider"
                  >
                    Autofill
                  </button>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] font-medium">
                    6-Digit Security Code <span className="text-[#78542E]">*</span>
                  </label>
                  {/* Expiry countdown badge */}
                  <span
                    className={`font-mono text-[11px] ${
                      expirySeconds < 60 ? "text-[#DC2626] font-semibold" : "text-[#78542E]"
                    }`}
                  >
                    Expires in {formatTimer(expirySeconds)}
                  </span>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={index === 0 ? 6 : 2}
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      value={digit}
                      aria-label={`Digit ${index + 1} of verification code`}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      onFocus={(e) => e.target.select()}
                      disabled={
                        expirySeconds <= 0 ||
                        (remainingAttempts !== null && remainingAttempts <= 0)
                      }
                      className={`w-full h-12 text-center font-mono text-lg font-semibold border rounded-xs transition-all bg-[#FFFFFF] ${
                        otpError
                          ? "border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                          : "border-[#D5D1C7] focus:border-[#121312] focus:ring-1 focus:ring-[#121312]"
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p
                    role="alert"
                    className="mt-2 text-xs text-[#DC2626] font-mono leading-relaxed"
                  >
                    {otpError}
                  </p>
                )}

                {remainingAttempts !== null &&
                  remainingAttempts > 0 &&
                  remainingAttempts < 5 && (
                    <p className="mt-1.5 text-[11px] text-[#78542E] font-mono">
                      {remainingAttempts} attempt{remainingAttempts === 1 ? "" : "s"} remaining before code invalidation.
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 uppercase tracking-[0.14em] text-xs font-medium"
                isLoading={isLoading}
                disabled={
                  expirySeconds <= 0 ||
                  (remainingAttempts !== null && remainingAttempts <= 0)
                }
                loadingText="Verifying Code..."
                aria-label="Verify Code"
              >
                Verify Code
              </Button>

              {/* Resend Cooldown & Switch Email */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E6E4DE] text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldownSeconds > 0 || isLoading}
                  className={`font-mono text-xs transition-colors ${
                    cooldownSeconds > 0
                      ? "text-[#8E8A80] cursor-not-allowed"
                      : "text-[#78542E] hover:text-[#121312] underline"
                  }`}
                >
                  {cooldownSeconds > 0
                    ? `Resend available in ${cooldownSeconds}s`
                    : "Resend Code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("EMAIL");
                    setOtpError("");
                  }}
                  className="text-[#63655E] hover:text-[#121312] underline font-sans"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP D: COMPLETE PROFILE (New User)                               */}
          {/* ================================================================= */}
          {step === "PROFILE" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6" noValidate>
              {/* Verified Email Banner */}
              <div className="p-3 bg-[#F4EDE2] border border-[#D5C2A5] rounded-xs flex items-center justify-between">
                <div className="truncate">
                  <span className="block font-mono text-[10px] uppercase text-[#78542E]">
                    Verified Email
                  </span>
                  <span className="font-sans text-xs font-medium text-[#121312] truncate">
                    {email}
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#78542E] text-[#FBFBF9]">
                  ✓ Verified
                </span>
              </div>

              <Input
                label="Full Name"
                id="auth-profile-name"
                name="fullName"
                autoComplete="name"
                placeholder="e.g. Lord Julian Sterling"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (nameError) setNameError("");
                }}
                error={nameError}
                isRequired
                autoFocus
              />

              <Input
                label="Telephone Number (Optional)"
                id="auth-profile-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+44 20 7946 0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                helperText="Used by listing advisors to coordinate private property access."
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 uppercase tracking-[0.14em] text-xs font-medium"
                isLoading={isLoading}
                loadingText="Completing Registration..."
              >
                Complete Registration &amp; Enter
              </Button>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP SUCCESS: DIRECT SESSION ESTABLISHED                          */}
          {/* ================================================================= */}
          {step === "SUCCESS" && (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#121312] text-[#FBFBF9] flex items-center justify-center font-mono text-lg font-bold">
                ✓
              </div>
              <p className="font-serif text-xl text-[#121312]">
                {searchParams?.get("intent") === "save"
                  ? "Residence Saved to Portfolio"
                  : "Session Established"}
              </p>
              <p className="font-mono text-xs text-[#78542E]">
                {searchParams?.get("intent") === "save"
                  ? "Redirecting to your saved collection..."
                  : "Redirecting to your destination..."}
              </p>
            </div>
          )}
        </div>

        {/* Available Terms & Privacy Policy Links */}
        <div className="pt-8 mt-auto border-t border-[#E6E4DE]/60 text-center">
          <p className="text-[11px] font-sans text-[#8E8A80] leading-relaxed">
            By continuing, you agree to AURA&apos;s{" "}
            <Link
              href="/about#terms"
              className="text-[#63655E] hover:text-[#121312] underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/about#privacy"
              className="text-[#63655E] hover:text-[#121312] underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-[10px] font-mono text-[#A8A49A] mt-2 uppercase tracking-wider">
            Fiduciary Passwordless Security • Anti-Enumeration Protection
          </p>
        </div>
      </section>
    </div>
  );
}
