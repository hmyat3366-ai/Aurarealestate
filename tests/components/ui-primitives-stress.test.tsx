import React, { useState } from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ToastProvider, useToast } from "@/components/ui/Toast";

describe("Milestone 1 UI Primitives Stress Testing", () => {
  // =========================================================================
  // 1. Modal.tsx Empirical Stress Tests
  // =========================================================================
  describe("Modal.tsx Stress Suite", () => {
    beforeEach(() => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });

    afterEach(() => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      vi.clearAllTimers();
    });

    it("STRESS-MODAL-1: Focus trap wraps correctly between first and last interactive elements", async () => {
      vi.useFakeTimers();
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Focus Trap Modal">
          <input data-testid="input-1" placeholder="First input" />
          <button data-testid="btn-inside">Inside Button</button>
          <a href="#test" data-testid="link-inside">Inside Link</a>
        </Modal>
      );

      // Fast-forward initial focus timeout (50ms)
      act(() => {
        vi.advanceTimersByTime(55);
      });

      const closeBtn = screen.getByRole("button", { name: /close dialog/i });
      const lastElem = screen.getByTestId("link-inside");

      // Verify close button or first interactive element received focus
      expect(document.activeElement).toBe(closeBtn);

      // Shift+Tab from closeBtn should wrap to last element
      fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(lastElem);

      // Tab from last element should wrap back to first element (closeBtn)
      fireEvent.keyDown(window, { key: "Tab", shiftKey: false });
      expect(document.activeElement).toBe(closeBtn);

      vi.useRealTimers();
    });

    it("STRESS-MODAL-2: Initial focus focuses the first enabled element when the first button is disabled", async () => {
      vi.useFakeTimers();
      // Render modal with showCloseButton={false} and first element as a disabled button
      render(
        <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false} title="Disabled First">
          <button disabled data-testid="disabled-btn">Disabled</button>
          <input data-testid="enabled-input" />
        </Modal>
      );

      act(() => {
        vi.advanceTimersByTime(60);
      });

      const enabledInput = screen.getByTestId("enabled-input");
      expect(document.activeElement).toBe(enabledInput);
      vi.useRealTimers();
    });

    it("STRESS-MODAL-3: Focus escapes modal if Shift+Tab is pressed when focus is on the dialog container", () => {
      const { getByRole } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Container Focus Escape">
          <button data-testid="btn-1">Btn 1</button>
        </Modal>
      );

      const dialog = getByRole("dialog");
      // Focus the dialog container directly
      dialog.focus();
      expect(document.activeElement).toBe(dialog);

      // Press Shift+Tab while focus is on dialog (not on firstElement)
      const tabEvent = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
      window.dispatchEvent(tabEvent);

      // Since document.activeElement !== firstElement, default is NOT prevented!
      expect(tabEvent.defaultPrevented).toBe(false);
    });

    it("STRESS-MODAL-4: Stacked modals both close on single Escape key press due to global window listener", () => {
      const handleCloseModal1 = vi.fn();
      const handleCloseModal2 = vi.fn();

      render(
        <>
          <Modal isOpen={true} onClose={handleCloseModal1} title="Modal Layer 1">
            <p>Layer 1</p>
          </Modal>
          <Modal isOpen={true} onClose={handleCloseModal2} title="Modal Layer 2">
            <p>Layer 2</p>
          </Modal>
        </>
      );

      fireEvent.keyDown(window, { key: "Escape" });

      // Both modals receive the window keydown event and call onClose
      expect(handleCloseModal1).toHaveBeenCalledTimes(1);
      expect(handleCloseModal2).toHaveBeenCalledTimes(1);
    });

    it("STRESS-MODAL-5: Rapid opening and closing cycles clean up body styles without leaking", () => {
      function RapidToggleModal() {
        const [open, setOpen] = useState(false);
        return (
          <div>
            <button data-testid="toggle" onClick={() => setOpen((prev) => !prev)}>Toggle</button>
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Rapid Modal">
              <button data-testid="inner">Inner</button>
            </Modal>
          </div>
        );
      }

      render(<RapidToggleModal />);
      const toggleBtn = screen.getByTestId("toggle");

      expect(document.body.style.overflow).toBe("");

      // Rapidly toggle 10 times in synchronous succession
      for (let i = 0; i < 10; i++) {
        fireEvent.click(toggleBtn);
      }

      // After an even number of toggles (10), modal is closed and overflow is restored
      expect(document.body.style.overflow).toBe("");
    });

    it("STRESS-MODAL-6: Body scroll lock cleanup restores pre-existing body paddingRight", () => {
      // Suppose the layout had a pre-existing paddingRight (e.g., fixed header offset or custom scrollbar compensation)
      document.body.style.paddingRight = "16px";

      const { unmount } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Padding Preservation">
          <p>Modal Content</p>
        </Modal>
      );

      unmount();

      expect(document.body.style.paddingRight).toBe("16px");
    });
  });

  // =========================================================================
  // 2. Select.tsx Empirical Stress Tests
  // =========================================================================
  describe("Select.tsx Stress Suite", () => {
    it("STRESS-SELECT-1: Pressing Enter/Space on an open empty Select does not throw error and handles safely", () => {
      render(<Select options={[]} placeholder="No options available" />);
      const trigger = screen.getByRole("combobox");

      // Open the empty select dropdown
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // aria-activedescendant does not point to a non-existent option
      expect(trigger.getAttribute("aria-activedescendant")).toBeNull();

      // Enter key does not crash
      expect(() => {
        fireEvent.keyDown(trigger, { key: "Enter" });
      }).not.toThrow();

      // Space key does not crash
      expect(() => {
        fireEvent.keyDown(trigger, { key: " " });
      }).not.toThrow();
    });

    it("STRESS-SELECT-2: Home key highlights the first enabled option bypassing disabled ones", () => {
      const optionsWithDisabledFirst = [
        { value: "opt-0", label: "Option 0 (Disabled)", disabled: true },
        { value: "opt-1", label: "Option 1 (Active)" },
        { value: "opt-2", label: "Option 2 (Active)" },
      ];

      render(<Select options={optionsWithDisabledFirst} defaultValue="opt-2" />);
      const trigger = screen.getByRole("combobox");

      // Open
      fireEvent.click(trigger);

      // Press Home key
      fireEvent.keyDown(trigger, { key: "Home" });

      // Home sets highlightedIndex = 1 bypassing disabled opt-0
      expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-1"));
    });

    it("STRESS-SELECT-3: End key highlights the last enabled option bypassing disabled ones", () => {
      const optionsWithDisabledLast = [
        { value: "opt-0", label: "Option 0 (Active)" },
        { value: "opt-1", label: "Option 1 (Active)" },
        { value: "opt-2", label: "Option 2 (Disabled)", disabled: true },
      ];

      render(<Select options={optionsWithDisabledLast} defaultValue="opt-0" />);
      const trigger = screen.getByRole("combobox");

      fireEvent.click(trigger);
      fireEvent.keyDown(trigger, { key: "End" });

      // End sets highlightedIndex = 1 bypassing disabled opt-2
      expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-1"));
    });

    it("STRESS-SELECT-4: Escape key in Select stops event propagation to outer listeners", () => {
      const outerEscapeHandler = vi.fn();
      render(
        <div onKeyDown={outerEscapeHandler}>
          <Select
            options={[
              { value: "1", label: "One" },
              { value: "2", label: "Two" },
            ]}
          />
        </div>
      );

      const trigger = screen.getByRole("combobox");
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // Press Escape on trigger
      fireEvent.keyDown(trigger, { key: "Escape" });

      // Dropdown closes
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      // Event does not bubble to outer container
      expect(outerEscapeHandler).not.toHaveBeenCalled();
    });

    it("STRESS-SELECT-5: Long option labels render with truncate styling on trigger", () => {
      const ultraLongLabel = "A".repeat(300);
      render(
        <Select
          options={[{ value: "long", label: ultraLongLabel }]}
          value="long"
        />
      );

      const trigger = screen.getByRole("combobox");
      const span = trigger.querySelector("span");
      expect(span).not.toBeNull();
      expect(span?.className).toContain("truncate");
    });
  });

  // =========================================================================
  // 3. Button.tsx Empirical Stress Tests
  // =========================================================================
  describe("Button.tsx Stress Suite", () => {
    it("STRESS-BUTTON-1: Rapid clicks during isLoading are blocked by the disabled attribute", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading={true} loadingText="Saving..." onClick={handleClick}>
          Confirm
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();

      // Fire 10 rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("STRESS-BUTTON-2: Disabled button is excluded from sequential tab focus", () => {
      render(
        <div>
          <button data-testid="before">Before</button>
          <Button disabled data-testid="btn-disabled">Disabled Action</Button>
          <button data-testid="after">After</button>
        </div>
      );

      const disabledBtn = screen.getByTestId("btn-disabled");
      expect(disabledBtn).toBeDisabled();

      // In HTML / jsdom, disabled buttons cannot receive focus
      disabledBtn.focus();
      expect(document.activeElement).not.toBe(disabledBtn);
    });

    it("STRESS-BUTTON-3: Disabled state focus isolation — button retains active focus without blurring or isolating focus", () => {
      function DynamicButton() {
        const [disabled, setDisabled] = useState(false);
        return (
          <div>
            <Button data-testid="action-btn" disabled={disabled} onClick={() => setDisabled(true)}>
              Click to Disable
            </Button>
          </div>
        );
      }

      render(<DynamicButton />);
      const btn = screen.getByTestId("action-btn");
      btn.focus();
      expect(document.activeElement).toBe(btn);

      fireEvent.click(btn);

      // Once disabled, Button.tsx does not blur or manage focus
      // The disabled button remains document.activeElement
      expect(btn).toBeDisabled();
      expect(document.activeElement).toBe(btn);
    });
  });

  // =========================================================================
  // 4. Toast.tsx Empirical Stress Tests
  // =========================================================================
  describe("Toast.tsx Stress Suite", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("STRESS-TOAST-1: Spawning a second toast does not reset the dismissal timer of the first toast", () => {
      function ToastHarness() {
        const { toast } = useToast();
        return (
          <div>
            <button data-testid="toast-1" onClick={() => toast({ title: "Toast 1", duration: 4000 })}>
              Fire 1
            </button>
            <button data-testid="toast-2" onClick={() => toast({ title: "Toast 2", duration: 4000 })}>
              Fire 2
            </button>
          </div>
        );
      }

      render(
        <ToastProvider>
          <ToastHarness />
        </ToastProvider>
      );

      // Trigger Toast 1 at t=0
      fireEvent.click(screen.getByTestId("toast-1"));
      expect(screen.getByText("Toast 1")).toBeInTheDocument();

      // Advance by 3000ms (1000ms remaining for Toast 1)
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText("Toast 1")).toBeInTheDocument();

      // Trigger Toast 2 at t=3000ms.
      fireEvent.click(screen.getByTestId("toast-2"));
      expect(screen.getByText("Toast 1")).toBeInTheDocument();
      expect(screen.getByText("Toast 2")).toBeInTheDocument();

      // Advance by 1500ms (total elapsed since Toast 1: 4500ms > initial duration 4000ms)
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Toast 1 has dismissed at its intended 4000ms mark, while Toast 2 remains
      expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
      expect(screen.getByText("Toast 2")).toBeInTheDocument();

      // Advance remaining time (another 2600ms) to dismiss Toast 2
      act(() => {
        vi.advanceTimersByTime(2600);
      });
      expect(screen.queryByText("Toast 2")).not.toBeInTheDocument();
    });

    it("STRESS-TOAST-2: Hover pause prevents dismissal, and resume resumes remaining duration", () => {
      function ToastHarness() {
        const { toast } = useToast();
        return (
          <button data-testid="fire" onClick={() => toast({ title: "Hover Toast", duration: 3000 })}>
            Fire
          </button>
        );
      }

      render(
        <ToastProvider>
          <ToastHarness />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId("fire"));
      const toastEl = screen.getByText("Hover Toast").closest("[role='status']")!;
      expect(toastEl).toBeInTheDocument();

      // Advance 2500ms (only 500ms left)
      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(screen.getByText("Hover Toast")).toBeInTheDocument();

      // Mouse enter -> pauseTimer clears timeout and saves remaining time (~500ms)
      fireEvent.mouseEnter(toastEl);

      // Advance by 5000ms while paused
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // Still in document
      expect(screen.getByText("Hover Toast")).toBeInTheDocument();

      // Mouse leave -> resumeTimer starts timer for remaining 500ms
      fireEvent.mouseLeave(toastEl);

      // Advance by 600ms (more than 500ms remaining)
      act(() => {
        vi.advanceTimersByTime(600);
      });
      // Correctly dismissed without resetting to full 3000ms
      expect(screen.queryByText("Hover Toast")).not.toBeInTheDocument();
    });

    it("STRESS-TOAST-3: Rapid consecutive toasts accumulate in DOM without capping", () => {
      function ToastSpammer() {
        const { toast } = useToast();
        return (
          <button
            data-testid="spam"
            onClick={() => {
              for (let i = 0; i < 20; i++) {
                toast({ title: `Spam Toast ${i}`, duration: 5000 });
              }
            }}
          >
            Spam
          </button>
        );
      }

      render(
        <ToastProvider>
          <ToastSpammer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId("spam"));

      const toasts = screen.getAllByRole("status");
      // All 20 toasts are rendered into DOM with no limit/queue cap
      expect(toasts).toHaveLength(20);
    });

    it("STRESS-TOAST-4: Zero or negative duration toasts never auto-dismiss and remain permanently in DOM", () => {
      function ZeroDurationHarness() {
        const { toast } = useToast();
        return (
          <button
            data-testid="zero-toast"
            onClick={() => {
              toast({ title: "Permanent Toast", duration: 0 });
            }}
          >
            Trigger Permanent
          </button>
        );
      }

      render(
        <ToastProvider>
          <ZeroDurationHarness />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId("zero-toast"));
      expect(screen.getByText("Permanent Toast")).toBeInTheDocument();

      // Advance by 1 minute
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      // Still in DOM because duration <= 0 bypasses setTimeout
      expect(screen.getByText("Permanent Toast")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 5. Composite Primitive Interaction Stress Tests
  // =========================================================================
  describe("Composite Primitives Interaction Stress Suite", () => {
    it("STRESS-COMPOSITE-1: Pressing Escape on an open Select inside a Modal closes only the Select and keeps Modal open", () => {
      const handleCloseModal = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleCloseModal} title="Inquiry Dialog">
          <Select
            id="modal-select"
            label="Inquiry Type"
            options={[
              { value: "buy", label: "Buying" },
              { value: "rent", label: "Renting" },
            ]}
          />
        </Modal>
      );

      const selectTrigger = screen.getByRole("combobox");
      // Open the select
      fireEvent.click(selectTrigger);
      expect(selectTrigger).toHaveAttribute("aria-expanded", "true");

      // User presses Escape to close the Select dropdown
      fireEvent.keyDown(selectTrigger, { key: "Escape" });

      // Select dropdown closes
      expect(selectTrigger).toHaveAttribute("aria-expanded", "false");

      // Modal stays open because Select stopped propagation
      expect(handleCloseModal).not.toHaveBeenCalled();
    });

    it("STRESS-SELECT-6: Fast consecutive ArrowDown/ArrowUp navigation at boundaries stays clamped", () => {
      const options = [
        { value: "1", label: "First" },
        { value: "2", label: "Second" },
      ];
      render(<Select options={options} defaultValue="1" />);
      const trigger = screen.getByRole("combobox");

      fireEvent.click(trigger);

      // Rapidly press ArrowDown 5 times past the end
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(trigger, { key: "ArrowDown" });
      }
      expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-1"));

      // Rapidly press ArrowUp 5 times past the start
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(trigger, { key: "ArrowUp" });
      }
      expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("-opt-0"));
    });
  });
});
