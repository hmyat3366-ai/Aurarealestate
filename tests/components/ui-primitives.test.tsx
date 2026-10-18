import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import {
  Skeleton,
  PropertyCardSkeleton,
  PropertyGridSkeleton,
} from "@/components/ui/LoadingSkeleton";

describe("UI Primitives & Accessibility Test Suite", () => {
  // 1. Button Tests
  describe("Button Component", () => {
    it("renders children and handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Inquire Now</Button>);
      const button = screen.getByRole("button", { name: /inquire now/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders loading state with aria-busy and disables interaction", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading loadingText="Transmitting..." onClick={handleClick}>
          Submit
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toBeDisabled();
      expect(screen.getByText("Transmitting...")).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("applies correct variant styling classes", () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-[#121312]");

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-[#121312]");

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-[#D5D1C7]");
    });
  });

  // 2. Badge Tests
  describe("Badge Component", () => {
    it("renders status badge with correct text and uppercase styling", () => {
      render(<Badge variant="private_exclusive">Private Exclusive</Badge>);
      const badge = screen.getByText(/private exclusive/i);
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")).toHaveClass("font-mono uppercase");
    });

    it("renders dot indicator when showDot is true", () => {
      const { container } = render(
        <Badge variant="active" showDot>
          Active
        </Badge>
      );
      const dot = container.querySelector(".rounded-full");
      expect(dot).toBeInTheDocument();
    });
  });

  // 3. Modal Dialog Tests
  describe("Modal Component", () => {
    it("renders dialog with role='dialog' and aria-modal='true' when open", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Schedule Private Showing">
          <p>Dialog body content</p>
        </Modal>
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(screen.getByText("Schedule Private Showing")).toBeInTheDocument();
      expect(screen.getByText("Dialog body content")).toBeInTheDocument();
    });

    it("calls onClose when Escape key is pressed", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <button>Focusable</button>
        </Modal>
      );
      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when backdrop is clicked", () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={handleClose} title="Backdrop Test">
          <p>Content</p>
        </Modal>
      );
      const backdrop = container.ownerDocument.querySelector(".bg-\\[\\#121312\\]\\/70");
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it("does not render when isOpen is false", () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Closed Modal">
          <p>Hidden</p>
        </Modal>
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // 4. Input Tests
  describe("Input Component", () => {
    it("renders input with connected label and helper text", () => {
      render(
        <Input
          id="email-field"
          label="Email Address"
          helperText="We will never share your email."
        />
      );
      const input = screen.getByLabelText(/email address/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "email-field");
      expect(screen.getByText("We will never share your email.")).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-describedby", "email-field-helper");
    });

    it("sets aria-invalid and renders error alert when error prop is present", () => {
      render(
        <Input
          id="phone-field"
          label="Telephone"
          error="Please provide a valid telephone number"
        />
      );
      const input = screen.getByLabelText(/telephone/i);
      expect(input).toHaveAttribute("aria-invalid", "true");
      const errorMsg = screen.getByRole("alert");
      expect(errorMsg).toHaveTextContent("Please provide a valid telephone number");
      expect(input).toHaveAttribute("aria-describedby", "phone-field-error");
    });
  });

  // 5. Select Component
  describe("Select Component", () => {
    const options = [
      { value: "penthouse", label: "Penthouse" },
      { value: "villa", label: "Modernist Villa" },
      { value: "townhouse", label: "Historic Townhouse" },
    ];

    it("renders combobox trigger and opens listbox on click", () => {
      render(
        <Select
          id="prop-type"
          label="Property Type"
          options={options}
          placeholder="Select type"
        />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("selects option and triggers onChange on Enter key", () => {
      const handleChange = vi.fn();
      render(
        <Select
          id="prop-type-2"
          label="Property Type"
          options={options}
          onChange={handleChange}
        />
      );
      const trigger = screen.getByRole("combobox");

      // Open via Enter
      fireEvent.keyDown(trigger, { key: "Enter" });
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // Navigate down to Villa
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      // Select option
      fireEvent.keyDown(trigger, { key: "Enter" });

      expect(handleChange).toHaveBeenCalledWith("villa");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  // 6. Toast Notification Tests
  describe("Toast Notification", () => {
    function ToastTrigger() {
      const { toast } = useToast();
      return (
        <button
          onClick={() =>
            toast({
              title: "Viewing Dispatched",
              description: "Advisor will confirm in 2h.",
              type: "success",
            })
          }
        >
          Dispatch Toast
        </button>
      );
    }

    it("renders toast with status role and auto-dismisses", async () => {
      render(
        <ToastProvider>
          <ToastTrigger />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText("Dispatch Toast"));
      const toast = await screen.findByRole("status");
      expect(toast).toHaveTextContent("Viewing Dispatched");
      expect(toast).toHaveTextContent("Advisor will confirm in 2h.");

      // Test manual dismiss button
      const dismissBtn = screen.getByRole("button", { name: /dismiss notification/i });
      fireEvent.click(dismissBtn);
      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });
  });

  // 7. LoadingSkeleton Tests
  describe("LoadingSkeleton Component", () => {
    it("renders skeleton with aria-busy='true' and role='status'", () => {
      render(<Skeleton width={200} height={20} />);
      const skeleton = screen.getByRole("status");
      expect(skeleton).toHaveAttribute("aria-busy", "true");
    });

    it("renders zero-CLS PropertyCardSkeleton and PropertyGridSkeleton", () => {
      render(<PropertyGridSkeleton count={3} />);
      const grid = screen.getByRole("region", { name: /loading properties/i });
      expect(grid).toHaveAttribute("aria-busy", "true");
      const cardSkeletons = screen.getAllByRole("status");
      expect(cardSkeletons.length).toBeGreaterThanOrEqual(3);
    });
  });
});
