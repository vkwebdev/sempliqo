import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

export interface LoadingItem {
  id: string;
  scope?: "global" | "overlay" | "inline";
  message?: string;
  progress?: number; // 0 - 100 if real upload/download progress is known
}

interface LoadingContextType {
  activeLoaders: LoadingItem[];
  isGlobalLoading: boolean;
  isOverlayLoading: boolean;
  startLoading: (id: string, options?: { scope?: "global" | "overlay" | "inline"; message?: string; progress?: number }) => void;
  updateLoading: (id: string, updates: Partial<Omit<LoadingItem, "id">>) => void;
  stopLoading: (id: string) => void;
  isLoading: (id?: string) => boolean;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loaders, setLoaders] = useState<LoadingItem[]>([]);
  // Avoid memory leaks or rapid flicker by tracking active IDs
  const activeIdsRef = useRef<Set<string>>(new Set());

  const startLoading = useCallback(
    (id: string, options?: { scope?: "global" | "overlay" | "inline"; message?: string; progress?: number }) => {
      activeIdsRef.current.add(id);
      setLoaders((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        return [
          ...filtered,
          {
            id,
            scope: options?.scope || "global",
            message: options?.message,
            progress: options?.progress,
          },
        ];
      });
    },
    []
  );

  const updateLoading = useCallback((id: string, updates: Partial<Omit<LoadingItem, "id">>) => {
    setLoaders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const stopLoading = useCallback((id: string) => {
    activeIdsRef.current.delete(id);
    setLoaders((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isLoading = useCallback(
    (id?: string) => {
      if (id) {
        return activeIdsRef.current.has(id);
      }
      return loaders.length > 0;
    },
    [loaders]
  );

  const isGlobalLoading = loaders.some((l) => l.scope === "global");
  const isOverlayLoading = loaders.some((l) => l.scope === "overlay");

  // Safety cleanup: Ensure document body scroll isn't trapped if overlay is active
  useEffect(() => {
    if (isOverlayLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlayLoading]);

  return (
    <LoadingContext.Provider
      value={{
        activeLoaders: loaders,
        isGlobalLoading,
        isOverlayLoading,
        startLoading,
        updateLoading,
        stopLoading,
        isLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
