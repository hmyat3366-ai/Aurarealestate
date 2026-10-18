import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ViewingModal } from "@/components/inquiry/ViewingModal";
import { PROPERTIES } from "@/data/properties";
import * as AuthContextModule from "@/context/AuthContext";

describe("Milestone 3: ViewingModal & Viewing Request Workflow", () => {
  const property = PROPERTIES[0];

  it("renders modal with modality toggle, date/time inputs, and contact fields", () => {
    const handleClose = vi.fn();
    render(
      <ViewingModal
        isOpen={true}
        onClose={handleClose}
        property={property}
      />
    );

    // Modal dialog
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Schedule a Private Viewing")).toBeInTheDocument();

    // Modality options
    expect(screen.getByRole("radio", { name: /in-person showing/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /video walkthrough/i })).toBeInTheDocument();

    // Time brackets
    expect(screen.getByRole("radio", { name: /morning/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /afternoon/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /evening/i })).toBeInTheDocument();

    // Contact fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telephone number/i)).toBeInTheDocument();
  });

  it("validates required fields and displays inline error messages on invalid submit", async () => {
    render(
      <ViewingModal
        isOpen={true}
        onClose={vi.fn()}
        property={property}
      />
    );

    // Click submit without entering required inputs
    const submitBtn = screen.getByRole("button", { name: /request appointment/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Full name must be at least 2 characters.")).toBeInTheDocument();
    expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Please provide a valid telephone number.")).toBeInTheDocument();
    expect(screen.getByText("Please select a preferred viewing date.")).toBeInTheDocument();
  });

  it("switches tour modality between In-Person and Video Walkthrough", () => {
    render(
      <ViewingModal
        isOpen={true}
        onClose={vi.fn()}
        property={property}
      />
    );

    const videoRadio = screen.getByRole("radio", { name: /video walkthrough/i });
    fireEvent.click(videoRadio);
    expect(videoRadio).toHaveAttribute("aria-checked", "true");

    const inPersonRadio = screen.getByRole("radio", { name: /in-person showing/i });
    expect(inPersonRadio).toHaveAttribute("aria-checked", "false");
    fireEvent.click(inPersonRadio);
    expect(inPersonRadio).toHaveAttribute("aria-checked", "true");
  });

  it("submits valid form and displays mandatory explicit pending confirmation status", async () => {
    const handleSuccess = vi.fn();
    render(
      <ViewingModal
        isOpen={true}
        onClose={vi.fn()}
        property={property}
        onSuccess={handleSuccess}
      />
    );

    // Select date (click first date chip, e.g. Tomorrow)
    const dateChip = screen.getByRole("button", { name: /tomorrow/i });
    fireEvent.click(dateChip);

    // Fill in valid contact fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Lord Sterling Vance" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "sterling.vance@example.co.uk" },
    });
    fireEvent.change(screen.getByLabelText(/telephone number/i), {
      target: { value: "+44 20 7123 4567" },
    });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /request appointment/i });
    fireEvent.click(submitBtn);

    // Verify confirmation view appears with mandatory explicit pending notice
    await waitFor(
      () => {
        expect(
          screen.getByText(/Viewing Request Submitted — Pending Manual Confirmation/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Mandatory notice text check
    expect(
      screen.getByText(
        /Private showings require 24-hour advance coordination with the property owner and dedicated listing advisor/i
      )
    ).toBeInTheDocument();

    // Verify appointment summary details
    expect(screen.getByText(/Reference Code/i)).toBeInTheDocument();
    expect(screen.getByText(/VS-VR-/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to calendar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close window/i })).toBeInTheDocument();

    expect(handleSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "pending_confirmation",
        fullName: "Lord Sterling Vance",
        email: "sterling.vance@example.co.uk",
      })
    );
  });

  it("auto-populates authenticated user contact details when user is signed in", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: {
        id: "usr_authed_1",
        email: "julian@aurarealestate.com",
        fullName: "Lord Julian Sterling",
        phone: "+44 20 7946 0888",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      isLoading: false,
      isAuthenticated: true,
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      completeRegistration: vi.fn(),
      updateProfile: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <ViewingModal
        isOpen={true}
        onClose={vi.fn()}
        property={property}
      />
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Lord Julian Sterling");
    expect(screen.getByLabelText(/email address/i)).toHaveValue("julian@aurarealestate.com");
    expect(screen.getByLabelText(/telephone number/i)).toHaveValue("+44 20 7946 0888");
    expect(screen.getByText(/Private Client:/i)).toBeInTheDocument();
  });

  it("synchronizes server-generated reference code from /api/inquiries", async () => {
    vi.spyOn(global, "fetch").mockImplementation(async (url: any) => {
      if (typeof url === "string" && url.includes("/api/inquiries")) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            referenceCode: "VS-VR-PROP-SERVER-7777",
            status: "pending_confirmation",
          }),
        } as Response;
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    render(
      <ViewingModal
        isOpen={true}
        onClose={vi.fn()}
        property={property}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /tomorrow/i }));
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Lady Vance" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "vance@example.co.uk" },
    });
    fireEvent.change(screen.getByLabelText(/telephone number/i), {
      target: { value: "+44 20 7111 2222" },
    });

    fireEvent.click(screen.getByRole("button", { name: /request appointment/i }));

    await waitFor(() => {
      expect(screen.getByText("VS-VR-PROP-SERVER-7777")).toBeInTheDocument();
    });
  });
});
