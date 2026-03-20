"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SearchContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
