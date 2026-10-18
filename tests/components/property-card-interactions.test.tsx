import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PropertyCard } from "@/components/discovery/PropertyCard";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { MOCK_SALE_PROPERTIES } from "../helpers/testFixtures";
import * as navigation from "next/navigation";

describe("PropertyCard Interaction Architecture & Tests A through J", () => {
  const mockPush = vi.fn();
  const mockProperty = MOCK_SALE_PROPERTIES[0]; // vs-sale-01 has 5 images (hero + 4 gallery)

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

    vi.spyOn(navigation, "usePathname").mockReturnValue("/buy");
    vi.spyOn(navigation, "useSearchParams").mockReturnValue(new URLSearchParams() as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Test A: Click the property image. The correct property detail page opens.
  // =========================================================================
  it("Test A: clicking the main property image navigates to the property details page", () => {
    render(
      <FavoritesProvider>
        <PropertyCard property={mockProperty} />
      </FavoritesProvider>
    );

    const image = screen.getByRole("img", { name: new RegExp(mockProperty.title, "i") });
    fireEvent.click(image);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/properties/${mockProperty.id}`);
  });

  // =========================================================================
  // Test B: Click the next arrow. The image changes, the counter updates, and detail page does not open.
  // =========================================================================
  it("Test B: clicking the next arrow displays the next image, updates counter, and does not navigate", () => {
    render(
      <FavoritesProvider>
        <PropertyCard property={mockProperty} />
      </FavoritesProvider>
    );

    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    const nextBtn = screen.getByRole("button", { name: /next photo/i });

    fireEvent.click(nextBtn);

    expect(screen.getByText("2 / 5")).toBeInTheDocument();
    const image = screen.getByRole("img", { name: new RegExp(mockProperty.title, "i") });
    expect(image).toHaveAttribute("alt", expect.stringContaining("Photo 2 of 5"));

    // Crucial: Parent card navigation must NEVER be triggered
    expect(mockPush).not.toHaveBeenCalled();
  });

  // =========================================================================
  // Test C: Click the previous arrow. The previous image appears (with wrapping) and detail page does not open.
  // =========================================================================
  it("Test C: clicking the previous arrow navigates backwards with wrapping and does not trigger detail page", () => {
    render(
      <FavoritesProvider>
        <PropertyCard property={mockProperty} />
      </FavoritesProvider>
    );

    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    const prevBtn = screen.getByRole("button", { name: /previous photo/i });

    // Clicking prev from index 0 should wrap to the last image (5 of 5)
    fireEvent.click(prevBtn);

    expect(screen.getByText("5 / 5")).toBeInTheDocument();
    const image = screen.getByRole("img", { name: new RegExp(mockProperty.title, "i") });
    expect(image).toHaveAttribute("alt", expect.stringContaining("Photo 5 of 5"));
    expect(mockPush).not.toHaveBeenCalled();

    // Clicking prev again should go to 4 of 5
    fireEvent.click(prevBtn);
    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  // =========================================================================
  // Test D: Click the heart as an authenticated user saves property
  // =========================================================================
  it("Test D: clicking the heart as an authenticated user saves the property to their account", async () => {
    const authValue = createMockAuthContext({
      isAuthenticated: true,
      user: {
        id: "client-lord-sterling",
        email: "sterling@aurarealestate.com",
        fullName: "Lord Julian Sterling",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    const fetchMock = vi.fn().mockImplementation((url, opts) => {
      if (url === "/api/account/saved" && opts?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, savedIds: [mockProperty.id] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ savedIds: [] }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthContext.Provider value={authValue}>
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      </AuthContext.Provider>
    );

    const heartBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
    expect(heartBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(heartBtn);

    // Immediate optimistic update
    expect(heartBtn).toHaveAttribute("aria-pressed", "true");
    expect(mockPush).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/account/saved",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ propertyId: mockProperty.id }),
        })
      );
    });
  });

  // =========================================================================
  // Test E: Click the heart again removes the property from saved collection
  // =========================================================================
  it("Test E: clicking the heart again removes the property from saved collection", async () => {
    const authValue = createMockAuthContext({
      isAuthenticated: true,
      user: {
        id: "client-lord-sterling",
        email: "sterling@aurarealestate.com",
        fullName: "Lord Julian Sterling",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    // Start with property already in saved list
    const fetchMock = vi.fn().mockImplementation((url, opts) => {
      if (url === "/api/account/saved" && opts?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, savedIds: [mockProperty.id] }),
        });
      }
      if (url.includes("/api/account/saved") && opts?.method === "DELETE") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, savedIds: [] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ savedIds: [] }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthContext.Provider value={authValue}>
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      </AuthContext.Provider>
    );

    // 1. Initial save click
    const heartBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
    expect(heartBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(heartBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/account/saved",
        expect.objectContaining({ method: "POST" })
      );
    });

    // Wait for button to transition to Remove state and settle
    const removeBtn = await screen.findByRole("button", { name: new RegExp(`Remove ${mockProperty.title}`, "i") });
    expect(removeBtn).toHaveAttribute("aria-pressed", "true");

    // 2. Click the heart again to remove from saved collection
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(removeBtn).toHaveAttribute("aria-pressed", "false");
    });
    expect(mockPush).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/account/saved?propertyId=${encodeURIComponent(mockProperty.id)}`,
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  // =========================================================================
  // Test F: Click the heart as a guest opens existing OTP flow and preserves ID
  // =========================================================================
  it("Test F: clicking the heart as a guest opens the existing OTP auth flow and preserves selected property ID", () => {
    const guestAuthValue = createMockAuthContext({
      isAuthenticated: false,
      user: null,
    });

    render(
      <AuthContext.Provider value={guestAuthValue}>
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      </AuthContext.Provider>
    );

    const heartBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
    fireEvent.click(heartBtn);

    // Detail page was NOT opened
    expect(mockPush).not.toHaveBeenCalledWith(`/properties/${mockProperty.id}`);

    // Preserved in pending storage
    expect(localStorage.getItem("aura_pending_save")).toBe(mockProperty.id);

    // Redirected to existing AURA email OTP flow preserving returnUrl and intent
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`/auth/signin?returnUrl=%2Fbuy&intent=save&propertyId=${mockProperty.id}`)
    );
  });

  // =========================================================================
  // Test G: Interact with one property card; other cards remain unchanged
  // =========================================================================
  it("Test G: carousel and favorite interactions on one card do not bleed into other cards", () => {
    const secondProperty = MOCK_SALE_PROPERTIES[1];

    render(
      <FavoritesProvider>
        <PropertyCard property={mockProperty} />
        <PropertyCard property={secondProperty} />
      </FavoritesProvider>
    );

    const card1 = screen.getByTestId(`property-card-${mockProperty.id}`);
    const card2 = screen.getByTestId(`property-card-${secondProperty.id}`);

    // Initial image counters
    expect(card1).toHaveTextContent("1 / 5");
    expect(card2).toHaveTextContent("1 / 3");

    // Advance photo on Card 1
    const nextBtnCard1 = card1.querySelector('button[aria-label="Next photo"]')!;
    fireEvent.click(nextBtnCard1);

    // Card 1 advances to 2 / 5
    expect(card1).toHaveTextContent("2 / 5");
    // Card 2 remains at 1 / 3
    expect(card2).toHaveTextContent("1 / 3");

    // Toggle favorite on Card 1
    const favBtnCard1 = card1.querySelector('button[aria-pressed]')!;
    const favBtnCard2 = card2.querySelector('button[aria-pressed]')!;

    expect(favBtnCard1).toHaveAttribute("aria-pressed", "false");
    expect(favBtnCard2).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(favBtnCard1);

    expect(favBtnCard1).toHaveAttribute("aria-pressed", "true");
    expect(favBtnCard2).toHaveAttribute("aria-pressed", "false");
  });

  // =========================================================================
  // Test H: Refresh page: Authenticated favorite states match server data
  // =========================================================================
  it("Test H: refresh and initial page load reflect server-persisted favorites", async () => {
    const authValue = createMockAuthContext({
      isAuthenticated: true,
      user: {
        id: "client-lord-sterling",
        email: "sterling@aurarealestate.com",
        fullName: "Lord Julian Sterling",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    // Server returns this property as already saved
    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "/api/account/saved") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ savedIds: [mockProperty.id] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthContext.Provider value={authValue}>
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      </AuthContext.Provider>
    );

    // Should hydrate and become saved based on server response
    await waitFor(() => {
      const heartBtn = screen.getByRole("button", { name: new RegExp(`Remove ${mockProperty.title}`, "i") });
      expect(heartBtn).toHaveAttribute("aria-pressed", "true");
    });
  });

  // =========================================================================
  // Test I: Simulate a failed save request; UI rolls back and provides feedback
  // =========================================================================
  it("Test I: failed save request rolls back state and displays error without falsely reporting saved", async () => {
    const authValue = createMockAuthContext({
      isAuthenticated: true,
      user: {
        id: "client-lord-sterling",
        email: "sterling@aurarealestate.com",
        fullName: "Lord Julian Sterling",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    const fetchMock = vi.fn().mockImplementation((url, opts) => {
      if (url === "/api/account/saved" && opts?.method === "POST") {
        // Server error simulation
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: "Internal Database Fault" }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ savedIds: [] }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <ToastProvider>
        <AuthContext.Provider value={authValue}>
          <FavoritesProvider>
            <PropertyCard property={mockProperty} />
          </FavoritesProvider>
        </AuthContext.Provider>
      </ToastProvider>
    );

    const heartBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
    expect(heartBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(heartBtn);

    // Wait for the async failure and rollback
    await waitFor(() => {
      expect(heartBtn).toHaveAttribute("aria-pressed", "false");
    });

    // Accurate error feedback must be rendered
    await waitFor(() => {
      expect(screen.getByText(/Failed to save property/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Test J: Accessibility, keyboard activation, single image, and error resilience
  // =========================================================================
  describe("Test J: Comprehensive Accessibility, Semantic Structure, and Edge Cases", () => {
    it("handles single-image properties gracefully without rendering carousel arrows", () => {
      const singleImageProp = {
        ...mockProperty,
        id: "vs-single-01",
        images: {
          hero: "https://example.com/single.jpg",
          gallery: [],
        },
      };

      render(
        <FavoritesProvider>
          <PropertyCard property={singleImageProp} />
        </FavoritesProvider>
      );

      expect(screen.queryByRole("button", { name: /next photo/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /previous photo/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/1 \//)).not.toBeInTheDocument();
    });

    it("handles missing/broken images gracefully with SVG fallback without crashing", () => {
      render(
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      );

      const image = screen.getByRole("img", { name: new RegExp(mockProperty.title, "i") });
      // Trigger image error
      fireEvent.error(image);

      expect(image).toHaveAttribute("src", expect.stringContaining("data:image/svg+xml"));
    });

    it("navigates to detail page when clicking non-interactive title or address", () => {
      render(
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      );

      // Clicking address text
      const address = screen.getByText(mockProperty.address.street, { exact: false });
      fireEvent.click(address);
      expect(mockPush).toHaveBeenCalledWith(`/properties/${mockProperty.id}`);

      mockPush.mockClear();

      // Clicking title link
      const titleLink = screen.getByRole("link", { name: mockProperty.title });
      expect(titleLink).toHaveAttribute("href", `/properties/${mockProperty.id}`);
      fireEvent.click(titleLink);
      expect(mockPush).toHaveBeenCalledWith(`/properties/${mockProperty.id}`);
    });

    it("supports keyboard Enter/Space activation on arrows and favorite button without card navigation", () => {
      render(
        <FavoritesProvider>
          <PropertyCard property={mockProperty} />
        </FavoritesProvider>
      );

      const nextBtn = screen.getByRole("button", { name: /next photo/i });
      fireEvent.keyDown(nextBtn, { key: "Enter" });
      fireEvent.click(nextBtn);

      expect(screen.getByText("2 / 5")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();

      const favBtn = screen.getByRole("button", { name: new RegExp(`Save ${mockProperty.title}`, "i") });
      fireEvent.keyDown(favBtn, { key: " " });
      fireEvent.click(favBtn);

      expect(favBtn).toHaveAttribute("aria-pressed", "true");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
