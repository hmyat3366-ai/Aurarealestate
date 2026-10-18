import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithRouter } from "../helpers/renderWithRouter";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { User } from "@/types/auth";

const mockGuestAuth: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
  completeRegistration: vi.fn(),
  updateProfile: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn(),
};

const mockAuthenticatedUser: User = {
  id: "usr_auraclient001",
  email: "julian.vane@aurarealestate.com",
  fullName: "Julian Vane",
  phone: "+44 20 7946 0912",
  createdAt: "2026-10-15T12:00:00Z",
  updatedAt: "2026-10-15T12:00:00Z",
};

const mockAuthenticatedAuth: AuthContextType = {
  user: mockAuthenticatedUser,
  isLoading: false,
  isAuthenticated: true,
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
  completeRegistration: vi.fn(),
  updateProfile: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn(),
};

function renderHeaderWithAuth(authValue: AuthContextType = mockGuestAuth, initialPath = "/") {
  return renderWithRouter(
    <AuthContext.Provider value={authValue}>
      <FavoritesProvider>
        <Header />
      </FavoritesProvider>
    </AuthContext.Provider>,
    { initialPathname: initialPath }
  );
}

function renderMobileNavWithAuth(
  authValue: AuthContextType = mockGuestAuth,
  isOpen = true,
  onClose = vi.fn()
) {
  return renderWithRouter(
    <AuthContext.Provider value={authValue}>
      <FavoritesProvider>
        <MobileNav isOpen={isOpen} onClose={onClose} />
      </FavoritesProvider>
    </AuthContext.Provider>,
    { initialPathname: "/" }
  );
}

describe("AURA Real Estate — Finalized Header Authentication States", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("1. Guest State — Not Authenticated (Desktop Header)", () => {
    it("displays AURA Real Estate logo and full primary navigation", () => {
      renderHeaderWithAuth(mockGuestAuth);

      // Logo
      expect(
        screen.getByLabelText(/AURA Real Estate — Return to Homepage/i)
      ).toBeInTheDocument();

      // Primary navigation links
      expect(screen.getByRole("link", { name: /^Buy$/i })).toHaveAttribute("href", "/buy");
      expect(screen.getByRole("link", { name: /^Rent$/i })).toHaveAttribute("href", "/rent");
      expect(screen.getByRole("link", { name: /^Sell with Us$/i })).toHaveAttribute(
        "href",
        "/sell"
      );
      expect(screen.getByRole("link", { name: /^About$/i })).toHaveAttribute(
        "href",
        "/about"
      );
      expect(screen.getByRole("link", { name: /^Contact$/i })).toHaveAttribute(
        "href",
        "/contact"
      );
    });

    it("displays SIGN IN button linking to /auth/signin", () => {
      renderHeaderWithAuth(mockGuestAuth);

      const signInLink = screen.getByRole("link", { name: /^Sign In$/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/auth/signin");
    });

    it("strictly hides BOOK A VALUATION in guest state", () => {
      renderHeaderWithAuth(mockGuestAuth);

      const valuationLink = screen.queryByRole("link", { name: /Book a Valuation/i });
      expect(valuationLink).not.toBeInTheDocument();
    });

    it("strictly hides MY AURA account menu in guest state", () => {
      renderHeaderWithAuth(mockGuestAuth);

      const myAuraBtn = screen.queryByRole("button", { name: /MY AURA/i });
      expect(myAuraBtn).not.toBeInTheDocument();
    });

    it("does NOT display a separate SAVED button in the header", () => {
      renderHeaderWithAuth(mockGuestAuth);

      const savedLink = screen.queryByLabelText(/Saved residences/i);
      expect(savedLink).not.toBeInTheDocument();

      // Also ensure no standalone "Saved" link is rendered
      const savedButton = screen.queryByRole("link", { name: /^Saved$/i });
      expect(savedButton).not.toBeInTheDocument();
    });
  });

  describe("2. Authenticated State — Successful OTP Login (Desktop Header)", () => {
    it("displays BOOK A VALUATION button linking to /sell", () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const valuationLink = screen.getByRole("link", { name: /Book a Valuation/i });
      expect(valuationLink).toBeInTheDocument();
      expect(valuationLink).toHaveAttribute("href", "/sell");
    });

    it("displays MY AURA account menu trigger with user status", () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const myAuraBtn = screen.getByRole("button", { name: /MY AURA account menu/i });
      expect(myAuraBtn).toBeInTheDocument();
      expect(myAuraBtn).toHaveAttribute("aria-expanded", "false");
      expect(myAuraBtn).toHaveAttribute("aria-haspopup", "menu");
    });

    it("strictly hides SIGN IN button when authenticated", () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const signInLink = screen.queryByRole("link", { name: /^Sign In$/i });
      expect(signInLink).not.toBeInTheDocument();
    });

    it("does NOT display a separate SAVED button in the header", () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const savedLink = screen.queryByLabelText(/Saved residences/i);
      expect(savedLink).not.toBeInTheDocument();
    });
  });

  describe("3. My AURA Account Menu Functionality & Accessibility", () => {
    it("opens dropdown menu on trigger click and displays all 5 required menu items in order", async () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const myAuraBtn = screen.getByRole("button", { name: /MY AURA account menu/i });
      fireEvent.click(myAuraBtn);

      expect(myAuraBtn).toHaveAttribute("aria-expanded", "true");

      const menu = screen.getByRole("menu", { name: /MY AURA Account Menu/i });
      expect(menu).toBeInTheDocument();

      // Client identity display
      expect(screen.getByText("Julian Vane")).toBeInTheDocument();
      expect(screen.getByText("julian.vane@aurarealestate.com")).toBeInTheDocument();

      // Verify the 5 required menu items:
      // 1. Overview — /account
      const overviewItem = screen.getByRole("menuitem", { name: /^Overview$/i });
      expect(overviewItem).toBeInTheDocument();
      expect(overviewItem).toHaveAttribute("href", "/account");

      // 2. Saved Properties — /account/saved
      const savedItem = screen.getByRole("menuitem", { name: /Saved Properties/i });
      expect(savedItem).toBeInTheDocument();
      expect(savedItem).toHaveAttribute("href", "/account/saved");

      // 3. My Viewings & Booking History — /account/viewings
      const viewingsItem = screen.getByRole("menuitem", {
        name: /My Viewings & Booking History/i,
      });
      expect(viewingsItem).toBeInTheDocument();
      expect(viewingsItem).toHaveAttribute("href", "/account/viewings");

      // 4. My Profile — /account/profile
      const profileItem = screen.getByRole("menuitem", { name: /^My Profile$/i });
      expect(profileItem).toBeInTheDocument();
      expect(profileItem).toHaveAttribute("href", "/account/profile");

      // 5. Sign Out
      const signOutItem = screen.getByRole("menuitem", { name: /^Sign Out$/i });
      expect(signOutItem).toBeInTheDocument();
    });

    it("displays real saved properties count within the dropdown when favorites exist", () => {
      // Pre-populate favorites in localStorage
      localStorage.setItem("aura_real_estate_favorites", JSON.stringify(["res_mayfair_01", "res_tribeca_02"]));

      renderHeaderWithAuth(mockAuthenticatedAuth);

      const myAuraBtn = screen.getByRole("button", { name: /MY AURA account menu/i });
      fireEvent.click(myAuraBtn);

      const savedItem = screen.getByRole("menuitem", { name: /Saved Properties/i });
      expect(savedItem).toHaveTextContent("2");
    });

    it("supports keyboard Escape key to dismiss the account menu and restore focus to trigger", () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const myAuraBtn = screen.getByRole("button", { name: /MY AURA account menu/i });
      fireEvent.click(myAuraBtn);
      expect(screen.getByRole("menu", { name: /MY AURA Account Menu/i })).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(document, { key: "Escape" });
      expect(
        screen.queryByRole("menu", { name: /MY AURA Account Menu/i })
      ).not.toBeInTheDocument();
    });

    it("triggers logout when Sign Out is clicked", async () => {
      renderHeaderWithAuth(mockAuthenticatedAuth);

      const myAuraBtn = screen.getByRole("button", { name: /MY AURA account menu/i });
      fireEvent.click(myAuraBtn);

      const signOutItem = screen.getByRole("menuitem", { name: /^Sign Out$/i });
      fireEvent.click(signOutItem);

      expect(mockAuthenticatedAuth.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe("4. Mobile Navigation Responsiveness", () => {
    it("renders Guest mobile state: Sign In visible, Book a Valuation and separate Saved hidden", () => {
      renderMobileNavWithAuth(mockGuestAuth, true);

      // Sign In visible
      const signInLink = screen.getByRole("link", { name: /^Sign In$/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/auth/signin");

      // Book a Valuation hidden
      expect(screen.queryByRole("link", { name: /Book a Valuation/i })).not.toBeInTheDocument();

      // No separate Saved Residences link
      expect(screen.queryByRole("link", { name: /Saved Residences/i })).not.toBeInTheDocument();
    });

    it("renders Authenticated mobile state: Book a Valuation visible, MY AURA links nested, separate Saved hidden", () => {
      renderMobileNavWithAuth(mockAuthenticatedAuth, true);

      // Book a Valuation visible
      const valuationLink = screen.getByRole("link", { name: /Book a Valuation/i });
      expect(valuationLink).toBeInTheDocument();
      expect(valuationLink).toHaveAttribute("href", "/sell");

      // Sign In hidden
      expect(screen.queryByRole("link", { name: /^Sign In$/i })).not.toBeInTheDocument();

      // MY AURA section with user details
      expect(screen.getByText(/MY AURA — Private Client/i)).toBeInTheDocument();
      expect(screen.getByText("Julian Vane")).toBeInTheDocument();

      // All 4 account navigation items nested inside MY AURA
      expect(screen.getByRole("link", { name: /^Overview$/i })).toHaveAttribute(
        "href",
        "/account"
      );
      expect(screen.getByRole("link", { name: /Saved Properties/i })).toHaveAttribute(
        "href",
        "/account/saved"
      );
      expect(
        screen.getByRole("link", { name: /My Viewings & Booking History/i })
      ).toHaveAttribute("href", "/account/viewings");
      expect(screen.getByRole("link", { name: /^My Profile$/i })).toHaveAttribute(
        "href",
        "/account/profile"
      );

      // Sign Out button
      expect(screen.getByRole("button", { name: /^Sign Out$/i })).toBeInTheDocument();

      // No separate Saved Residences item outside MY AURA
      expect(screen.queryByRole("link", { name: /Saved Residences/i })).not.toBeInTheDocument();
    });
  });
});
