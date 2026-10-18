"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

export interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => Promise<boolean> | void;
  isFavorite: (id: string) => boolean;
  removeFavorite?: (id: string) => Promise<boolean> | void;
  count: number;
  isLoading?: boolean;
  lastError?: string | null;
  clearError?: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "aura_real_estate_favorites";
const LEGACY_STORAGE_KEY = "vane_sterling_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const prevUserRef = useRef<string | null>(null);

  const favoritesRef = useRef<string[]>(favorites);
  favoritesRef.current = favorites;

  const clearError = useCallback(() => setLastError(null), []);

  // Load guest favorites from localStorage initially
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          favoritesRef.current = parsed;
          setFavorites(parsed);
        }
      }
    } catch {
      // Ignore storage errors in test or private environments
    }
    setIsLoaded(true);
  }, []);

  // Sync with server when user signs in or changes
  useEffect(() => {
    async function syncOnAuthChange() {
      if (isAuthenticated && user?.id) {
        // If transitioning from unauthenticated to authenticated, merge guest favorites
        if (prevUserRef.current !== user.id) {
          prevUserRef.current = user.id;

          let guestIds: string[] = [];
          try {
            const stored =
              localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                guestIds = parsed;
              }
            }
          } catch {
            // Ignore storage errors
          }

          // Check pending save from guest favorite click
          try {
            const pendingSave = localStorage.getItem("aura_pending_save");
            if (pendingSave && !guestIds.includes(pendingSave)) {
              guestIds.push(pendingSave);
            }
            localStorage.removeItem("aura_pending_save");
          } catch {
            // Ignore storage errors
          }

          try {
            if (guestIds.length > 0) {
              // Merge guest favorites into server-persisted user favorites
              const res = await fetch("/api/account/saved/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyIds: guestIds }),
              });
              if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.savedIds)) {
                  favoritesRef.current = data.savedIds;
                  setFavorites(data.savedIds);
                  try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.savedIds));
                  } catch {
                    // Ignore storage errors
                  }
                  return;
                }
              }
            }

            // Fetch server favorites if no guest favorites to merge
            const res = await fetch("/api/account/saved");
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.savedIds)) {
                favoritesRef.current = data.savedIds;
                setFavorites(data.savedIds);
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.savedIds));
                } catch {
                  // Ignore storage errors
                }
              }
            }
          } catch {
            // Fallback to local favorites if network fails
          }
        }
      } else if (prevUserRef.current !== null) {
        // User logged out: purge user-specific favorites from state and localStorage to prevent cross-account leakage
        prevUserRef.current = null;
        favoritesRef.current = [];
        setFavorites([]);
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
          // Ignore storage errors
        }
      }
    }

    if (isLoaded) {
      syncOnAuthChange();
    }
  }, [isAuthenticated, user?.id, isLoaded]);

  // Toggle favorite with synchronous optimistic update & rollback on error
  const toggleFavorite = useCallback(
    (id: string): Promise<boolean> | void => {
      setLastError(null);
      const wasFavorite = favoritesRef.current.includes(id);
      const next = wasFavorite
        ? favoritesRef.current.filter((item) => item !== id)
        : [...favoritesRef.current, id];

      favoritesRef.current = next;
      setFavorites(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }

      // If authenticated, synchronize with server endpoint
      if (isAuthenticated) {
        return (async () => {
          try {
            const res = wasFavorite
              ? await fetch(`/api/account/saved?propertyId=${encodeURIComponent(id)}`, {
                  method: "DELETE",
                })
              : await fetch("/api/account/saved", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ propertyId: id }),
                });

            if (!res.ok) {
              throw new Error(
                wasFavorite
                  ? "Failed to remove property from saved residences."
                  : "Failed to save property to your account."
              );
            }

            const data = await res.json().catch(() => null);
            if (data?.savedIds && Array.isArray(data.savedIds)) {
              favoritesRef.current = data.savedIds;
              setFavorites(data.savedIds);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.savedIds));
              } catch {
                // Ignore
              }
            }
            return true;
          } catch (err) {
            // Rollback state on error
            setFavorites((prev) => {
              const rolled = wasFavorite
                ? (prev.includes(id) ? prev : [...prev, id])
                : prev.filter((item) => item !== id);
              favoritesRef.current = rolled;
              return rolled;
            });
            try {
              const currentStored = localStorage.getItem(STORAGE_KEY);
              const parsed = currentStored ? JSON.parse(currentStored) : [];
              const rolled = wasFavorite
                ? Array.from(new Set([...parsed, id]))
                : parsed.filter((x: string) => x !== id);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(rolled));
            } catch {
              // Ignore
            }
            const errMsg = err instanceof Error ? err.message : "Save operation failed.";
            setLastError(errMsg);
            return false;
          }
        })();
      }
    },
    [isAuthenticated]
  );

  // Remove favorite directly with rollback on error
  const removeFavorite = useCallback(
    async (id: string): Promise<boolean> => {
      setLastError(null);
      if (!favoritesRef.current.includes(id)) return true;
      const next = favoritesRef.current.filter((item) => item !== id);
      favoritesRef.current = next;
      setFavorites(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }

      if (isAuthenticated) {
        try {
          const res = await fetch(`/api/account/saved?propertyId=${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to remove saved property.");
          }
          const data = await res.json().catch(() => null);
          if (data?.savedIds && Array.isArray(data.savedIds)) {
            favoritesRef.current = data.savedIds;
            setFavorites(data.savedIds);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.savedIds));
            } catch {
              // Ignore
            }
          }
          return true;
        } catch (err) {
          // Rollback
          setFavorites((prev) => {
            const rolled = prev.includes(id) ? prev : [...prev, id];
            favoritesRef.current = rolled;
            return rolled;
          });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritesRef.current, id]));
          } catch {
            // Ignore
          }
          const errMsg = err instanceof Error ? err.message : "Failed to remove saved property.";
          setLastError(errMsg);
          return false;
        }
      }
      return true;
    },
    [isAuthenticated]
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.includes(id);
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        removeFavorite,
        isFavorite,
        count: isLoaded ? favorites.length : 0,
        isLoading: !isLoaded,
        lastError,
        clearError,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    return {
      favorites: [],
      toggleFavorite: () => {},
      removeFavorite: () => {},
      isFavorite: () => false,
      count: 0,
      isLoading: false,
    };
  }
  return context;
}
