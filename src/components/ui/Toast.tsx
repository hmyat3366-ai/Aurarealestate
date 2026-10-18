"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastContextValue {
  toast: (props: Omit<ToastMessage, "id">) => string;
  dismiss: (id: string) => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useOptionalToast(): ToastContextValue | null {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismiss = dismissToast;

  const handleDismissItem = useCallback(
    (id: string) => {
      dismissToast(id);
    },
    [dismissToast]
  );

  const toast = useCallback(
    ({ title, description, type = "info", duration = 4000 }: Omit<ToastMessage, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, title, description, type, duration };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissToast }}>
      {children}
      {/* Toast Viewport Live Region */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onDismiss={handleDismissItem} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: ((id: string) => void) | (() => void);
}) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const remainingRef = useRef<number>(toast.duration && toast.duration > 0 ? toast.duration : 0);
  const startRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerDismiss = useCallback(() => {
    (onDismissRef.current as (id?: string) => void)(toast.id);
  }, [toast.id]);

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      remainingRef.current = toast.duration;
      startRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        triggerDismiss();
      }, toast.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, triggerDismiss]);

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  const resumeTimer = () => {
    if (toast.duration && toast.duration > 0 && remainingRef.current > 0) {
      startRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        triggerDismiss();
      }, remainingRef.current);
    }
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: (
      <svg className="h-5 w-5 text-[#78542E]" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-[#D5D1C7]" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className="pointer-events-auto w-full bg-[#121312] text-[#FBFBF9] border border-[#4A4C48] rounded-xs shadow-ambient-lg p-4 flex items-start gap-3 transition-all duration-300 animate-slide-up"
    >
      <div className="shrink-0 mt-0.5" aria-hidden="true">
        {icons[toast.type || "info"]}
      </div>

      <div className="flex-1">
        <h3 className="font-sans text-sm font-medium tracking-wide text-[#FBFBF9]">{toast.title}</h3>
        {toast.description && (
          <p className="mt-1 font-sans text-xs text-[#D5D1C7] leading-relaxed">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={triggerDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 p-1 text-[#8E8A80] hover:text-[#FBFBF9] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
