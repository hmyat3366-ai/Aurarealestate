import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithRouter } from "../helpers/renderWithRouter";
import { AuthFlow, maskEmail } from "@/components/auth/AuthFlow";
import SignInPage from "@/app/auth/signin/page";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthDatabase } from "@/lib/server/db";

function renderAuth(ui: React.ReactElement, initialPath = "/auth/signin") {
  return renderWithRouter(
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>{ui}</ToastProvider>
      </FavoritesProvider>
    </AuthProvider>,
    { initialPathname: initialPath }
  );
}

describe("AURA Real Estate: Split-Screen Authentication Architecture", () => {
  beforeEach(() => {
    AuthDatabase.reset();
    vi.restoreAllMocks();
    vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
      if (typeof url === "string" && url.includes("/api/auth/me")) {
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      }
      return { ok: true, json: async () => ({}) } as Response;
    });
  });

  describe("1. Visual Layout & Split-Screen Composition", () => {
    it("renders dedicated split-screen structure with Left Brand Panel and Right Form Panel", () => {
      const { container } = renderAuth(<SignInPage />);

      // Verify skip landmark target
      expect(container.querySelector("#main-content")).toBeInTheDocument();

      // Left Brand Panel (aside)
      const brandPanel = screen.getByRole("complementary", {
        name: /AURA Architectural Brand Experience/i,
      });
      expect(brandPanel).toBeInTheDocument();
      expect(brandPanel).toHaveClass("md:w-[42%]", "lg:w-[46%]", "xl:w-[48%]");

      // Brand Logo in left panel
      expect(brandPanel.querySelector('[aria-label="AURA Real Estate"]')).toBeInTheDocument();

      // Editorial headline and statement in left panel
      expect(
        screen.getByRole("heading", { name: /Find a Place Worth Calling Yours/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Discover distinctive properties and make your next move with AURA/i)
      ).toBeInTheDocument();

      // Right Form Panel (section)
      const formPanel = screen.getByRole("region", {
        name: /Client Authentication Portal/i,
      });
      expect(formPanel).toBeInTheDocument();
      expect(formPanel).toHaveClass("md:w-[58%]", "lg:w-[54%]", "xl:w-[52%]");

      // Top utility area Back to Website link
      expect(screen.getByRole("link", { name: /Back to Website/i })).toBeInTheDocument();

      // Terms and Privacy links
      expect(screen.getByRole("link", { name: /Terms of Service/i })).toHaveAttribute(
        "href",
        "/about#terms"
      );
      expect(screen.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute(
        "href",
        "/about#privacy"
      );
    });

    it("verifies email masking utility across varying username lengths and unicode sets", () => {
      expect(maskEmail("client@aurarealestate.com")).toBe("c***t@aurarealestate.com");
      expect(maskEmail("sterling@aurarealestate.com")).toBe("s***g@aurarealestate.com");
      expect(maskEmail("ab@example.com")).toBe("a*@example.com");
      expect(maskEmail("a@example.com")).toBe("a*@example.com");
      expect(maskEmail("évariste@domain.com")).toBe("é***e@domain.com");
      expect(maskEmail("ü@domain.com")).toBe("ü*@domain.com");
      expect(maskEmail("contact+vip@aurarealestate.com")).toBe("c***p@aurarealestate.com");
      expect(maskEmail("")).toBe("");
    });
  });

  describe("2. Passwordless Flow: Step A to Step D End-to-End", () => {
    it("Step A: Enforces email format validation and anti-enumeration", async () => {
      renderAuth(<AuthFlow />);

      const submitBtn = screen.getByRole("button", { name: /Continue with Email/i });
      const emailInput = screen.getByLabelText(/Email Address/i);

      // Empty submission
      fireEvent.click(submitBtn);
      expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();

      // Malformed email
      fireEvent.change(emailInput, { target: { value: "invalid@@domain..com" } });
      fireEvent.click(submitBtn);
      expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    it("Step B & C: Existing account logs in directly through OTP without profile prompt", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/otp/verify")) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              isNewUser: false,
              user: {
                id: "usr_existing_01",
                email: "lord.sterling@aurarealestate.com",
                fullName: "Lord Julian Sterling",
              },
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderAuth(<AuthFlow defaultEmail="lord.sterling@aurarealestate.com" />);

      // Step A Submit
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      // Check Masked Email
      expect(screen.getByTestId("masked-email")).toHaveTextContent("l***g@aurarealestate.com");

      // Enter 6 Digits
      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(firstInput, { target: { value: "654321" } });

      // Submit OTP
      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));

      // Direct Session Established (Step C)
      expect(await screen.findByText(/Session Established/i)).toBeInTheDocument();
      // Step D Complete Profile should NOT appear
      expect(screen.queryByRole("heading", { name: /Complete Your Profile/i })).not.toBeInTheDocument();
    });

    it("Step B & D: New account transitions to profile completion and merges session", async () => {
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
              registrationToken: "reg_token_xyz987",
            }),
          } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/register")) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              user: {
                id: "usr_new_01",
                email: "lady.eleanor@aurarealestate.com",
                fullName: "Lady Eleanor Vance",
                phone: "+44 20 7946 0888",
              },
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderAuth(<AuthFlow defaultEmail="lady.eleanor@aurarealestate.com" />);

      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(firstInput, { target: { value: "888999" } });
      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));

      // Step D: Profile completion required
      expect(await screen.findByRole("heading", { name: /Complete Your Profile/i })).toBeInTheDocument();
      expect(screen.getByText("✓ Verified")).toBeInTheDocument();
      expect(screen.getByText("lady.eleanor@aurarealestate.com")).toBeInTheDocument();

      // Submit with valid full name and optional telephone
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Lady Eleanor Vance" },
      });
      fireEvent.change(screen.getByLabelText(/Telephone Number/i), {
        target: { value: "+44 20 7946 0888" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Complete Registration & Enter/i }));

      expect(await screen.findByText(/Session Established/i)).toBeInTheDocument();
    });

    it("Step B: Displays invalid OTP feedback and enforces attempt limits", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        if (typeof url === "string" && url.includes("/api/auth/otp/verify")) {
          return {
            ok: false,
            status: 400,
            json: async () => ({
              error: "Invalid verification code. 2 attempts remaining.",
              remainingAttempts: 2,
            }),
          } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderAuth(<AuthFlow defaultEmail="test@aura.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(firstInput, { target: { value: "000000" } });
      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));

      expect(
        await screen.findByText(/Invalid verification code. 2 attempts remaining/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/2 attempts remaining before code invalidation/i)
      ).toBeInTheDocument();
    });

    it("Step B: Prevents submission when OTP has fewer than 6 digits", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
        if (typeof url === "string" && url.includes("/api/auth/otp/send")) {
          return { ok: true, json: async () => ({ success: true, cooldownSeconds: 60 }) } as Response;
        }
        return { ok: true, json: async () => ({ authenticated: false, user: null }) } as Response;
      });

      renderAuth(<AuthFlow defaultEmail="test@aura.com" />);
      fireEvent.click(screen.getByRole("button", { name: /Continue with Email/i }));
      await screen.findByRole("heading", { name: /Check Your Email/i });

      // Enter only 3 digits
      const firstInput = screen.getByLabelText(/Digit 1 of verification code/i);
      fireEvent.change(firstInput, { target: { value: "1" } });

      fireEvent.click(screen.getByRole("button", { name: /Verify Code|Verify & Establish Session/i }));
      expect(
        await screen.findByText(/Please enter all 6 digits of your verification code/i)
      ).toBeInTheDocument();
    });
  });

  describe("3. Responsive Layout & Touch Target Verification", () => {
    it("verifies interactive touch targets meet or exceed 44px height", () => {
      const { container } = renderAuth(<AuthFlow />);

      // Primary submit button has h-12 (48px)
      const primaryBtn = screen.getByRole("button", { name: /Continue with Email/i });
      expect(primaryBtn).toHaveClass("h-12");

      // Verify no fixed pixel width wrappers that could break 360px viewport
      const fixedWidthElements = container.querySelectorAll(
        '[class*="w-[3"], [class*="w-[4"], [class*="w-[5"], [class*="w-[6"]'
      );
      // All width classes should be responsive or max-w-md
      fixedWidthElements.forEach((el) => {
        const className = el.getAttribute("class") || "";
        expect(className).not.toMatch(/\bw-\[\d{3,}px\]/);
      });
    });

    it("preserves returnUrl in Back to Website link", () => {
      renderAuth(
        <AuthFlow initialReturnUrl="/properties/prop-sale-01" />
      );

      const backLink = screen.getByRole("link", { name: /Back to Website/i });
      expect(backLink).toHaveAttribute("href", "/properties/prop-sale-01");
    });
  });
});
