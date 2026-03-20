"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppUser = {
  id: string;
  clerkId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  timezone: string;
  language: string;
};

type UserContextValue = {
  user: AppUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = useMemo(
    () => ({ user, isLoading, refresh: fetchUser }),
    [user, isLoading, fetchUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return ctx;
}
