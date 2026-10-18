import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PropertyCard } from "@/components/discovery/PropertyCard";
import { PropertyDetailView } from "@/components/property/PropertyDetailView";
import { ViewingModal } from "@/components/inquiry/ViewingModal";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { PROPERTIES } from "@/data/properties";
import * as navigation from "next/navigation";

// Mock server auth helper and database for API endpoint tests
import { GET as getSavedApi, POST as postSavedApi, DELETE as deleteSavedApi } from "@/app/api/account/saved/route";
import { GET as getViewingsApi, POST as postViewingsApi } from "@/app/api/account/viewings/route";
import { GET as getProfileApi, PATCH as patchProfileApi } from "@/app/api/account/profile/route";
import { NextRequest } from "next/server";

describe("AURA Real Estate — Authentication-Gated Feature Access Rules", () => {
  const mockPush = vi.fn();
  const mockProperty = PROPERTIES[0];

  const createMockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    sendOtp: vi.fn().mockResolvedValue({ success: true }),
    verifyOtp: vi.fn().mockResolvedValue({ success: true }),
    completeRegistration: vi.fn().mockResolvedValue({ success: true }),
    updateProfile: vi.fn().mockResolvedValue({ success: true }),
    logout: vi.fn().mockResolvedValue(undefined),
    refreshUser: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  const guestAuth = createMockAuthContext({
    isAuthenticated: false,
    user: null,
  });

  const authenticatedAuth = createMockAuthContext({
    isAuthenticated: true,
    user: {
      id: "usr_test_client_01",
      email: "eleanor.vance@aurarealestate.com",
      fullName: "Lady Eleanor Vance",
      phone: "+44 20 7946 0888",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    vi.spyOn(navigation, "useRouter").mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });

    vi.spyOn(navigation, "usePathname").mockReturnValue(`/properties/${mockProperty.id}`);
    vi.spyOn(navigation, "useSearchParams").mockReturnValue(new URLSearchParams() as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // SECTION 1: PUBLIC FEATURES (Unrestricted Guest Access)
  // =========================================================================
  describe("1. Public Features (Accessible to Guests without Authentication)", () => {
    it("allows guests to browse property listings and cards without auth restrictions", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <PropertyCard property={mockProperty} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(mockProperty.address.neighborhood, "i")).length).toBeGreaterThan(0);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("allows guests to use image carousel arrows and updates counter without redirecting", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <PropertyCard property={mockProperty} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByText("1 / 5")).toBeInTheDocument();
      const nextBtn = screen.getByRole("button", { name: /next photo/i });
      fireEvent.click(nextBtn);

      expect(screen.getByText("2 / 5")).toBeInTheDocument();
      // Crucial: No auth prompt or page navigation triggered
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("allows guests to view full property details, facts, amenities, and agent card", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <PropertyDetailView property={mockProperty} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      // Verify page title, specs, and advisor
      expect(screen.getByRole("heading", { level: 1, name: mockProperty.title })).toBeInTheDocument();
      expect(screen.getByText(/Property Specifications/i)).toBeInTheDocument();
      expect(screen.getByText(mockProperty.agent.name)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // SECTION 2: PROTECTED FEATURES & AUTH GATE BEHAVIOR
  // =========================================================================
  describe("2. Protected Features & Auth Gate Behavior", () => {
    it("gates guest favorite action on PropertyCard: preserves property ID and redirects to OTP flow", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <PropertyCard property={mockProperty} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      const heartBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
      fireEvent.click(heartBtn);

      // Preserves intended property in local pending storage
      expect(localStorage.getItem("aura_pending_save")).toBe(mockProperty.id);

      // Redirects to OTP sign-in preserving returnUrl, intent=save, and propertyId
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(`/auth/signin?returnUrl=%2Fproperties%2F${mockProperty.id}&intent=save&propertyId=${mockProperty.id}`)
      );
    });

    it("gates guest Save Residence button on PropertyDetailView: preserves ID and redirects to OTP flow", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <PropertyDetailView property={mockProperty} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      const saveBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
      fireEvent.click(saveBtn);

      expect(localStorage.getItem("aura_pending_save")).toBe(mockProperty.id);
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(`/auth/signin?returnUrl=%2Fproperties%2F${mockProperty.id}&intent=save&propertyId=${mockProperty.id}`)
      );
    });

    it("gates guest viewing request in ViewingModal: preserves date, time, modality, and redirects to OTP flow", async () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <ViewingModal
            isOpen={true}
            onClose={vi.fn()}
            property={mockProperty}
          />
        </AuthContext.Provider>
      );

      // Select date (e.g. Tomorrow chip)
      const dateChip = screen.getByRole("button", { name: /tomorrow/i });
      fireEvent.click(dateChip);

      // Select Video Walkthrough modality
      const videoRadio = screen.getByRole("radio", { name: /video walkthrough/i });
      fireEvent.click(videoRadio);

      // Enter contact details
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: "Lady Eleanor Vance" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "eleanor.vance@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/telephone number/i), {
        target: { value: "+44 20 7946 0888" },
      });

      // Submit form as guest
      const submitBtn = screen.getByRole("button", { name: /request appointment/i });
      fireEvent.click(submitBtn);

      // Verify pending viewing context was preserved
      const pendingRaw = localStorage.getItem("aura_pending_viewing");
      expect(pendingRaw).not.toBeNull();
      const pending = JSON.parse(pendingRaw!);
      expect(pending.propertyId).toBe(mockProperty.id);
      expect(pending.tourType).toBe("video");
      expect(pending.fullName).toBe("Lady Eleanor Vance");
      expect(pending.email).toBe("eleanor.vance@example.com");

      // Verify redirect to OTP flow preserving returnUrl, intent=viewing, and prefilled email
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(`intent=viewing&propertyId=${mockProperty.id}&email=eleanor.vance%40example.com`)
      );
    });

    it("resumes preserved viewing request automatically without re-entering details", async () => {
      // Simulate user already authenticated after OTP flow with preserved pending viewing
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      localStorage.setItem(
        "aura_pending_viewing",
        JSON.stringify({
          propertyId: mockProperty.id,
          tourType: "video",
          preferredDate: tomorrowStr,
          preferredTime: "evening",
          hasAgent: "represented",
          notes: "Need private architectural floor plans prior to call.",
          phone: "+44 20 7946 0888",
        })
      );

      render(
        <AuthContext.Provider value={authenticatedAuth}>
          <ViewingModal
            isOpen={true}
            onClose={vi.fn()}
            property={mockProperty}
          />
        </AuthContext.Provider>
      );

      // Modality, date, time bracket, and notes must be restored without typing
      const videoRadio = screen.getByRole("radio", { name: /video walkthrough/i });
      expect(videoRadio).toHaveAttribute("aria-checked", "true");

      const eveningRadio = screen.getByRole("radio", { name: /evening/i });
      expect(eveningRadio).toHaveAttribute("aria-checked", "true");

      expect(screen.getByLabelText(/special requirements or notes/i)).toHaveValue(
        "Need private architectural floor plans prior to call."
      );

      // Authenticated client details auto-populated
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Lady Eleanor Vance");
      expect(screen.getByLabelText(/email address/i)).toHaveValue("eleanor.vance@aurarealestate.com");
      expect(screen.getByText(/Private Client:/i)).toBeInTheDocument();
    });

    it("displays completed appointment confirmation when viewing was submitted during auth flow", () => {
      localStorage.setItem(
        "aura_last_viewing_data",
        JSON.stringify({
          propertyId: mockProperty.id,
          referenceCode: "VS-VR-MAYFAIR-9999",
          tourType: "in-person",
          preferredDate: "2026-11-01",
          preferredTime: "afternoon",
          status: "pending_confirmation",
        })
      );

      render(
        <AuthContext.Provider value={authenticatedAuth}>
          <ViewingModal
            isOpen={true}
            onClose={vi.fn()}
            property={mockProperty}
          />
        </AuthContext.Provider>
      );

      // Instant confirmation view rendered with explicit pending confirmation status
      expect(screen.getByText(/Viewing Request Submitted — Pending Manual Confirmation/i)).toBeInTheDocument();
      expect(screen.getByText("VS-VR-MAYFAIR-9999")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add to calendar/i })).toBeInTheDocument();

      // Cleaned up storage
      expect(localStorage.getItem("aura_last_viewing_data")).toBeNull();
    });
  });

  // =========================================================================
  // SECTION 3: HEADER & NAVIGATION AUTHENTICATION STATES
  // =========================================================================
  describe("3. Header & Navigation Authentication State Enforcement", () => {
    it("guest header: displays SIGN IN, hides BOOK A VALUATION, MY AURA, and SAVED button", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <Header />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /book a valuation/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /my aura/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /^saved/i })).not.toBeInTheDocument();
    });

    it("authenticated header: hides SIGN IN, displays BOOK A VALUATION and MY AURA dropdown", () => {
      render(
        <AuthContext.Provider value={authenticatedAuth}>
          <FavoritesProvider>
            <Header />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      expect(screen.queryByRole("link", { name: /sign in/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /book a valuation/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /my aura/i })).toBeInTheDocument();
    });

    it("guest mobile nav: displays Sign In, conceals Book a Valuation and MY AURA", () => {
      render(
        <AuthContext.Provider value={guestAuth}>
          <FavoritesProvider>
            <MobileNav isOpen={true} onClose={vi.fn()} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /book a valuation/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/MY AURA — Private Client/i)).not.toBeInTheDocument();
    });

    it("authenticated mobile nav: displays Book a Valuation and MY AURA menu with Saved Properties", () => {
      render(
        <AuthContext.Provider value={authenticatedAuth}>
          <FavoritesProvider>
            <MobileNav isOpen={true} onClose={vi.fn()} />
          </FavoritesProvider>
        </AuthContext.Provider>
      );

      expect(screen.queryByRole("link", { name: /sign in/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /book a valuation/i })).toBeInTheDocument();
      expect(screen.getByText(/MY AURA — Private Client/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /saved properties/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /my viewings/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION 4: SERVER API ACCESS CONTROL ENFORCEMENT
  // =========================================================================
  describe("4. Server API Authentication Enforcement (401 Unauthorized for Guests)", () => {
    it("rejects unauthenticated GET /api/account/saved with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/account/saved", { method: "GET" });
      const res = await getSavedApi(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toMatch(/Authentication required/i);
    });

    it("rejects unauthenticated POST /api/account/saved with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/account/saved", {
        method: "POST",
        body: JSON.stringify({ propertyId: "vs-sale-01" }),
      });
      const res = await postSavedApi(req);
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated GET /api/account/viewings with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/account/viewings", { method: "GET" });
      const res = await getViewingsApi(req);
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated POST /api/account/viewings with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/account/viewings", {
        method: "POST",
        body: JSON.stringify({ propertyId: "vs-sale-01", preferredDate: "2026-11-01" }),
      });
      const res = await postViewingsApi(req);
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated GET /api/account/profile with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/account/profile", { method: "GET" });
      const res = await getProfileApi(req);
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated PATCH /api/account/profile with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({ fullName: "Intruder" }),
      });
      const res = await patchProfileApi(req);
      expect(res.status).toBe(401);
    });
  });
});
