"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, AuthState } from "@/types/auth";

export interface AuthContextType extends AuthState {
  sendOtp: (email: string) => Promise<{
    success: boolean;
    error?: string;
    message?: string;
    cooldownSeconds?: number;
    devCode?: string;
  }>;
  verifyOtp: (
    email: string,
    code: string
  ) => Promise<{
    success: boolean;
    error?: string;
    isNewUser?: boolean;
    registrationToken?: string;
    remainingAttempts?: number;
  }>;
  completeRegistration: (
    registrationToken: string,
    fullName: string,
    phone?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    user?: User;
  }>;
  updateProfile: (
    fullName: string,
    phone?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    user?: User;
  }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current session profile on mount
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Request OTP
  const sendOtp = useCallback(async (email: string) => {
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Failed to dispatch verification code.",
          cooldownSeconds: data.cooldownSeconds,
        };
      }
      return {
        success: true,
        message: data.message,
        cooldownSeconds: data.cooldownSeconds || 60,
        devCode:
          data?.devCode ||
          (typeof res.headers?.get === "function" ? res.headers.get("X-Aura-Test-Code") : undefined) ||
          undefined,
      };
    } catch {
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    }
  }, []);

  // Verify OTP
  const verifyOtp = useCallback(
    async (email: string, code: string) => {
      try {
        const res = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            success: false,
            error: data.error || "Verification failed.",
            remainingAttempts: data.remainingAttempts,
          };
        }

        if (!data.isNewUser && data.user) {
          setUser(data.user);
        }

        return {
          success: true,
          isNewUser: Boolean(data.isNewUser),
          registrationToken: data.registrationToken,
        };
      } catch {
        return {
          success: false,
          error: "Verification request failed. Please try again.",
        };
      }
    },
    []
  );

  // Complete Registration for New Users
  const completeRegistration = useCallback(
    async (registrationToken: string, fullName: string, phone?: string) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationToken, fullName, phone }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            success: false,
            error: data.error || "Profile completion failed.",
          };
        }

        if (data.user) {
          setUser(data.user);
        }

        return {
          success: true,
          user: data.user,
        };
      } catch {
        return {
          success: false,
          error: "Failed to submit profile. Please try again.",
        };
      }
    },
    []
  );

  // Update Profile
  const updateProfile = useCallback(
    async (fullName: string, phone?: string) => {
      try {
        const res = await fetch("/api/account/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phone }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            success: false,
            error: data.error || "Failed to update profile.",
          };
        }

        if (data.user) {
          setUser(data.user);
        }

        return {
          success: true,
          user: data.user,
        };
      } catch {
        return {
          success: false,
          error: "Network error while saving profile.",
        };
      }
    },
    []
  );

  // Sign Out
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Continue client cleanup even if network request fails
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        sendOtp,
        verifyOtp,
        completeRegistration,
        updateProfile,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      sendOtp: async () => ({ success: false, error: "Auth provider unavailable" }),
      verifyOtp: async () => ({ success: false, error: "Auth provider unavailable" }),
      completeRegistration: async () => ({
        success: false,
        error: "Auth provider unavailable",
      }),
      updateProfile: async () => ({
        success: false,
        error: "Auth provider unavailable",
      }),
      logout: async () => {},
      refreshUser: async () => {},
    };
  }
  return context;
}
