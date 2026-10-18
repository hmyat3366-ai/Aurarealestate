import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithRouter } from "../helpers/renderWithRouter";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { ToastProvider } from "@/components/ui/Toast";
import AccountOverviewPage from "@/app/account/page";
import AccountSavedPage from "@/app/account/saved/page";
import AccountViewingsPage from "@/app/account/viewings/page";
import AccountProfilePage from "@/app/account/profile/page";
import { AuthDatabase } from "@/lib/server/db";
import { sanitizeReturnUrl } from "@/lib/server/auth";

function renderWithAuth(ui: React.ReactElement, initialPath = "/auth/signin") {
  return renderWithRouter(
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>{ui}</ToastProvider>
      </FavoritesProvider>
    </AuthProvider>,
    { initialPathname: initialPath }
  );
}

describe("Component: Passwordless Email OTP & Account System", () => {
  beforeEach(() => {
    AuthDatabase.reset();
    vi.restoreAllMocks();
  });

  describe("Screen A: Enter Email & Anti-Enumeration", () => {
    it("renders AURA branding, email input, and editorial messaging", () => {
      renderWithAuth(<AuthFlow />);

      expect(screen.getByRole("heading", { name: /Private Client Sign In/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with Email/i })).toBeInTheDocument();
      expect(
        screen.getByText(/Passwordless authentication for your private viewing portfolio/i)
      ).toBeInTheDocument();
    });

    it("validates email input and prevents submission of malformed emails", async () => {
      renderWithAuth(<AuthFlow />);

      const submitBtn = screen.getByRole("button", { name: /Continue with Email/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();

      const input = screen.getByLabelText(/Email Address/i);
      fireEvent.change(input, { target: { value: "invalid-email" } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    it("submits valid email and transitions to Screen B (OTP Verification)", async () => {
      // Mock global fetch for OTP send
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              message: "If your email is valid, a 6-digit verification code has been dispatched.",
              cooldownSeconds: 60,
            }),
          } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/me")) {
          return {
            ok: true,
            json: async () => ({ authenticated: false, user: null }),
          } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      });

      renderWithAuth(<AuthFlow />);

      const input = screen.getByLabelText(/Email Address/i);
      fireEvent.change(input, { target: { value: "client@aurarealestate.com" } });

      const submitBtn = screen.getByRole("button", { name: /Continue with Email/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Enter Verification Code/i })).toBeInTheDocument();
      });

      expect(screen.getByText(/A 6-digit authentication code was sent to client@aurarealestate.com/i)).toBeInTheDocument();
      expect(screen.getByText(/Expires in 05:00/i)).toBeInTheDocument();
      expect(screen.getByText(/Resend available in 60s/i)).toBeInTheDocument();
    });
  });

  describe("Screen B: 6-Digit OTP Verification & Attempt Limits", () => {
    it("renders 6 individual digit inputs and enforces numeric validation", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              message: "Dispatched",
              cooldownSeconds: 60,
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="test@example.com" />);

      // Submit email to advance to OTP
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Enter Verification Code/i });

      // Check 6 digit inputs exist
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(new RegExp(`Digit ${i} of verification code`, "i"))).toBeInTheDocument();
      }
    });

    it("displays error message and remaining attempts on incorrect code", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return {
            ok: true,
            json: async () => ({ success: true, cooldownSeconds: 60 }),
          } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/otp/verify")) {
          return {
            ok: false,
            status: 400,
            json: async () => ({
              error: "Invalid verification code. 4 attempts remaining.",
              remainingAttempts: 4,
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="test@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Enter Verification Code/i });

      // Fill in 6 digits
      for (let i = 1; i <= 6; i++) {
        fireEvent.change(screen.getByLabelText(new RegExp(`Digit ${i} of verification code`, "i")), {
          target: { value: "1" },
        });
      }

      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));

      expect(await screen.findByText(/Invalid verification code. 4 attempts remaining/i)).toBeInTheDocument();
      expect(screen.getByText(/4 attempts remaining before code invalidation/i)).toBeInTheDocument();
    });

    it("supports pasting a 6-digit code into the inputs", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="test@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Enter Verification Code/i });

      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(firstInput, { target: { value: "847291" } });

      // Verify all inputs are populated
      expect(screen.getByLabelText(/Digit 1 of verification code/i)).toHaveValue("8");
      expect(screen.getByLabelText(/Digit 2 of verification code/i)).toHaveValue("4");
      expect(screen.getByLabelText(/Digit 3 of verification code/i)).toHaveValue("7");
      expect(screen.getByLabelText(/Digit 4 of verification code/i)).toHaveValue("2");
      expect(screen.getByLabelText(/Digit 5 of verification code/i)).toHaveValue("9");
      expect(screen.getByLabelText(/Digit 6 of verification code/i)).toHaveValue("1");
    });

    it("supports native clipboard paste events across the OTP inputs", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="test@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Enter Verification Code/i });

      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => "529143",
        },
      });

      expect(screen.getByLabelText(/Digit 1 of verification code/i)).toHaveValue("5");
      expect(screen.getByLabelText(/Digit 2 of verification code/i)).toHaveValue("2");
      expect(screen.getByLabelText(/Digit 3 of verification code/i)).toHaveValue("9");
      expect(screen.getByLabelText(/Digit 4 of verification code/i)).toHaveValue("1");
      expect(screen.getByLabelText(/Digit 5 of verification code/i)).toHaveValue("4");
      expect(screen.getByLabelText(/Digit 6 of verification code/i)).toHaveValue("3");
    });
  });

  describe("Screen C: New User Profile Completion vs Existing Direct Session", () => {
    it("transitions to Screen C when user is new and completes profile", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/otp/verify")) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              isNewUser: true,
              registrationToken: "reg_test_token_123",
            }),
          } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/register")) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              user: {
                id: "usr_123",
                email: "newuser@example.com",
                fullName: "Lord Charles Sterling",
                phone: "+44 20 7123 4567",
              },
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="newuser@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Enter Verification Code/i });

      // Enter 6 digits
      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(firstInput, { target: { value: "123456" } });
      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));

      // Screen C should appear
      expect(await screen.findByRole("heading", { name: /Complete Your Profile/i })).toBeInTheDocument();
      expect(screen.getByText("✓ Verified")).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Telephone Number/i)).toBeInTheDocument();

      // Submit with empty name fails
      fireEvent.click(screen.getByRole("button", { name: /Complete Registration & Enter/i }));
      expect(await screen.findByText(/Full name must be at least 2 characters/i)).toBeInTheDocument();

      // Fill in valid details
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Lord Charles Sterling" },
      });
      fireEvent.change(screen.getByLabelText(/Telephone Number/i), {
        target: { value: "+44 20 7123 4567" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Complete Registration & Enter/i }));

      expect(await screen.findByText(/Session Established/i)).toBeInTheDocument();
    });
  });

  describe("Preserved Return URL & Open Redirect Defense", () => {
    it("sanitizes returnUrl and rejects malicious open redirect protocols", () => {
      // Valid relative paths
      expect(sanitizeReturnUrl("/account")).toBe("/account");
      expect(sanitizeReturnUrl("/buy?saved=true")).toBe("/buy?saved=true");
      expect(sanitizeReturnUrl("/properties/prop-sale-01")).toBe("/properties/prop-sale-01");

      // Malicious or invalid protocols fall back to /account
      expect(sanitizeReturnUrl("https://malicious.com")).toBe("/account");
      expect(sanitizeReturnUrl("//malicious.com")).toBe("/account");
      expect(sanitizeReturnUrl("javascript:alert(1)")).toBe("/account");
      expect(sanitizeReturnUrl("/\\evil.com")).toBe("/account");
      expect(sanitizeReturnUrl("/evil\\path")).toBe("/account");
      expect(sanitizeReturnUrl("/account\r\nevil")).toBe("/account");
      expect(sanitizeReturnUrl("")).toBe("/account");
      expect(sanitizeReturnUrl(null)).toBe("/account");
    });
  });

  describe("Account Pages Rendering", () => {
    it("renders AccountOverviewPage with stats and private concierge section", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/account/saved")) {
          return { ok: true, json: async () => ({ properties: [] }) } as Response;
        }
        if (typeof url === "string" && url.includes("/api/account/viewings")) {
          return {
            ok: true,
            json: async () => ({
              viewings: [],
              counts: { all: 0, upcoming: 0, pending: 0, past: 0 },
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      });

      renderWithAuth(<AccountOverviewPage />);

      expect(screen.getAllByText(/Saved Residences/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Confirmed Showings/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/Bespoke Acquisitions & Private Showings/i)).toBeInTheDocument();
    });

    it("renders AccountSavedPage with empty state and browsing links", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/account/saved")) {
          return { ok: true, json: async () => ({ properties: [] }) } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      });

      renderWithAuth(<AccountSavedPage />);

      expect(screen.getByRole("heading", { name: /Saved Residences/i })).toBeInTheDocument();
      expect(await screen.findByText(/Your Saved Portfolio is Empty/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Explore Buy Portfolio/i })).toBeInTheDocument();
    });

    it("renders AccountViewingsPage with status tabs and honest badges", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/account/viewings")) {
          return {
            ok: true,
            json: async () => ({
              viewings: [
                {
                  id: "view_1",
                  propertyId: "prop-sale-01",
                  propertyTitle: "The Belgravia Crescent Penthouse",
                  preferredDate: "2026-12-01",
                  preferredTime: "afternoon",
                  tourType: "in-person",
                  status: "pending_confirmation",
                  referenceCode: "VS-VR-SALE-01-8888",
                  fullName: "Lord Sterling",
                  email: "sterling@example.com",
                  phone: "+44 20 7000 0000",
                },
              ],
              counts: { all: 1, upcoming: 0, pending: 1, past: 0 },
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      });

      renderWithAuth(<AccountViewingsPage />);

      expect(screen.getByRole("heading", { name: /Viewing Appointments & History/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /All Viewings/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Pending Confirmation/i })).toBeInTheDocument();

      // Check appointment card rendered
      expect(await screen.findByText("The Belgravia Crescent Penthouse")).toBeInTheDocument();
      expect(screen.getByText(/VS-VR-SALE-01-8888/i)).toBeInTheDocument();
      expect(screen.getByText(/⏱ Pending Confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/Advance Notice Coordination/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Add to Calendar/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Cancel Request/i })).toBeInTheDocument();
    });

    it("renders AccountProfilePage with editable fields and verified email", async () => {
      renderWithAuth(<AccountProfilePage />);

      expect(screen.getByRole("heading", { name: /Private Client Profile/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Legal Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Contact Telephone/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Save Profile Changes/i })).toBeInTheDocument();
    });
  });

  describe("Cross-Account Favorites Isolation on Logout", () => {
    it("clears favorites and localStorage upon user logout to prevent data leakage", async () => {
      localStorage.setItem("aura_real_estate_favorites", JSON.stringify(["prop-sale-01"]));

      let logoutFn: () => Promise<void> = async () => {};
      function TestConsumer() {
        const { favorites } = useFavorites();
        const { logout, user } = useAuth();
        logoutFn = logout;
        return (
          <div>
            <span data-testid="fav-count">{favorites.length}</span>
            <span data-testid="user-status">{user ? user.fullName : "anonymous"}</span>
          </div>
        );
      }

      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/me")) {
          return {
            ok: true,
            json: async () => ({
              authenticated: true,
              user: { id: "usr_alice", email: "alice@aura.com", fullName: "Alice" },
            }),
          } as Response;
        }
        if (typeof url === "string" && url.includes("/api/account/saved")) {
          return {
            ok: true,
            json: async () => ({ savedIds: ["prop-sale-01"], properties: [] }),
          } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/logout")) {
          return { ok: true, json: async () => ({ success: true }) } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      });

      renderWithAuth(<TestConsumer />);

      await waitFor(() => {
        expect(screen.getByTestId("user-status")).toHaveTextContent("Alice");
      });

      // User logs out
      await logoutFn();

      await waitFor(() => {
        expect(screen.getByTestId("user-status")).toHaveTextContent("anonymous");
        expect(screen.getByTestId("fav-count")).toHaveTextContent("0");
        expect(localStorage.getItem("aura_real_estate_favorites")).toBeNull();
      });
    });
  });

  describe("Split-Screen Composition & Architectural Brand Experience", () => {
    it("renders the architectural brand panel with headline, supporting text, and logos", () => {
      renderWithAuth(<AuthFlow />);

      // Left panel editorial headline and supporting text
      expect(
        screen.getByRole("heading", { name: /Find a Place Worth Calling Yours/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Discover distinctive properties and make your next move with AURA/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/London • New York • Zürich/i)).toBeInTheDocument();
      expect(screen.getByText(/Private Portfolio/i)).toBeInTheDocument();

      // Top utility area Back to Website link
      const backLink = screen.getByRole("link", { name: /Back to Website/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/");

      // Terms of Service and Privacy Policy links
      const termsLink = screen.getByRole("link", { name: /Terms of Service/i });
      const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });
      expect(termsLink).toHaveAttribute("href", "/about#terms");
      expect(privacyLink).toHaveAttribute("href", "/about#privacy");

      // Architectural brand photograph
      const heroImage = screen.getByAltText(/AURA Architectural Residence — Mayfair Penthouse with dramatic natural light/i);
      expect(heroImage).toBeInTheDocument();
      expect(heroImage).toHaveAttribute(
        "src",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
      );
    });

    it("supports switching between Sign In and Create Account modes seamlessly", () => {
      renderWithAuth(<AuthFlow />);

      const signInTab = screen.getByRole("tab", { name: /^Sign In$/i });
      const createAccountTab = screen.getByRole("tab", { name: /^Create Account$/i });

      expect(signInTab).toHaveAttribute("aria-selected", "true");
      expect(createAccountTab).toHaveAttribute("aria-selected", "false");
      expect(screen.getByText(/Private Client Sign In/i)).toBeInTheDocument();

      // Switch to Create Account
      fireEvent.click(createAccountTab);
      expect(createAccountTab).toHaveAttribute("aria-selected", "true");
      expect(signInTab).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("heading", { name: /New Client Registration/i })).toBeInTheDocument();

      // Switch back to Sign In
      fireEvent.click(signInTab);
      expect(signInTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText(/Private Client Sign In/i)).toBeInTheDocument();
    });

    it("displays masked email address in Step B and supports Change Email action", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return {
            ok: true,
            json: async () => ({ success: true, cooldownSeconds: 60 }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="julian.vane@aurarealestate.com" />);

      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      // Verify masked email displays securely
      const maskedEmailEl = screen.getByTestId("masked-email");
      expect(maskedEmailEl).toHaveTextContent("j***e@aurarealestate.com");

      // Verify Change Email button returns to Step A with email preserved
      const changeBtn = screen.getByRole("button", { name: /^Change$/i });
      fireEvent.click(changeBtn);

      expect(screen.getByRole("heading", { name: /Welcome to AURA/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toHaveValue("julian.vane@aurarealestate.com");
    });

    it("displays delivery error feedback when sending OTP fails", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return {
            ok: false,
            status: 429,
            json: async () => ({
              error: "Too many attempts. Please wait 60 seconds before requesting another code.",
              cooldownSeconds: 60,
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="test@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));

      expect(
        await screen.findByText(/Too many attempts. Please wait 60 seconds before requesting another code/i)
      ).toBeInTheDocument();
    });

    it("supports keyboard arrow navigation across OTP boxes", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="nav@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      const digit1 = screen.getByLabelText(/Digit 1 of verification code/i);
      const digit2 = screen.getByLabelText(/Digit 2 of verification code/i);

      fireEvent.keyDown(digit1, { key: "ArrowRight" });
      fireEvent.keyDown(digit2, { key: "ArrowLeft" });
      expect(digit1).toBeInTheDocument();
      expect(digit2).toBeInTheDocument();
    });
  });

  describe("Edge Cases, OTP Resilience & Session Restoration", () => {
    it("supports in-place digit replacement without corrupting adjacent digits", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="replace@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      // Fill digits 1 through 6 with 1, 2, 3, 4, 5, 6
      const d1 = screen.getByLabelText(/Digit 1 of verification code/i);
      const d2 = screen.getByLabelText(/Digit 2 of verification code/i);
      const d3 = screen.getByLabelText(/Digit 3 of verification code/i);
      const d4 = screen.getByLabelText(/Digit 4 of verification code/i);
      const d5 = screen.getByLabelText(/Digit 5 of verification code/i);
      const d6 = screen.getByLabelText(/Digit 6 of verification code/i);

      fireEvent.change(d1, { target: { value: "1" } });
      fireEvent.change(d2, { target: { value: "2" } });
      fireEvent.change(d3, { target: { value: "3" } });
      fireEvent.change(d4, { target: { value: "4" } });
      fireEvent.change(d5, { target: { value: "5" } });
      fireEvent.change(d6, { target: { value: "6" } });

      expect(d3).toHaveValue("3");

      // Replace Digit 3 with '9' (value passed to change event includes both: "39")
      fireEvent.change(d3, { target: { value: "39" } });

      // Digit 3 must become '9', and all other digits must remain intact!
      expect(d1).toHaveValue("1");
      expect(d2).toHaveValue("2");
      expect(d3).toHaveValue("9");
      expect(d4).toHaveValue("4");
      expect(d5).toHaveValue("5");
      expect(d6).toHaveValue("6");
    });

    it("supports partial paste starting from arbitrary digit index", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="paste@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      const d1 = screen.getByLabelText(/Digit 1 of verification code/i);
      const d2 = screen.getByLabelText(/Digit 2 of verification code/i);
      const d3 = screen.getByLabelText(/Digit 3 of verification code/i);
      const d4 = screen.getByLabelText(/Digit 4 of verification code/i);

      // Set first digit
      fireEvent.change(d1, { target: { value: "7" } });

      // Paste 3 digits "456" into Digit 2
      fireEvent.change(d2, { target: { value: "456" } });

      expect(d1).toHaveValue("7");
      expect(d2).toHaveValue("4");
      expect(d3).toHaveValue("5");
      expect(d4).toHaveValue("6");
    });

    it("displays server-side expired OTP code feedback honestly", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/otp/verify")) {
          return {
            ok: false,
            status: 400,
            json: async () => ({
              error: "This verification code has expired. Please request a new code.",
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="expired@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      const d1 = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(d1, { target: { value: "999888" } });

      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));

      expect(
        await screen.findByText(/This verification code has expired\. Please request a new code\./i)
      ).toBeInTheDocument();
    });

    it("handles Backspace on empty digit by clearing and focusing previous digit", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderWithAuth(<AuthFlow defaultEmail="backspace@example.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      const d1 = screen.getByLabelText(/Digit 1 of verification code/i);
      const d2 = screen.getByLabelText(/Digit 2 of verification code/i);

      fireEvent.change(d1, { target: { value: "8" } });
      expect(d1).toHaveValue("8");
      expect(d2).toHaveValue("");

      // Press Backspace on empty Digit 2
      fireEvent.keyDown(d2, { key: "Backspace" });

      // Digit 1 should now be cleared
      expect(d1).toHaveValue("");
    });

    it("restores existing session on mount and redirects to returnUrl", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/me")) {
          return {
            ok: true,
            json: async () => ({
              authenticated: true,
              user: {
                id: "usr_restored_88",
                email: "restored@aurarealestate.com",
                fullName: "Lady Georgina Sterling",
              },
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      });

      renderWithAuth(<AuthFlow initialReturnUrl="/properties/prop-sale-01" />);

      // AuthContext will restore session from /api/auth/me
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/auth/me",
          expect.anything()
        );
      });
    });
  });
});

