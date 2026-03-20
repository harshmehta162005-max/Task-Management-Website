import type { ReactNode } from "react";
import { UserProvider } from "@/components/providers/UserProvider";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
