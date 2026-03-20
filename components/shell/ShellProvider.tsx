"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ShellContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const ShellContext = createContext<ShellContextValue | undefined>(undefined);
const STORAGE_KEY = "shell:collapsed";

export function ShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // hydrate collapsed state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "1");
    }
  }, []);

  // persist collapsed state
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);

  const value = useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      setCollapsed,
      mobileOpen,
      setMobileOpen,
    }),
    [collapsed, mobileOpen, toggleCollapsed]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShellContext() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}
