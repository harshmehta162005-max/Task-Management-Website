import type { ReactNode } from "react";
import { UserProvider } from "@/components/providers/UserProvider";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ToastProvider>{children}</ToastProvider>
    </UserProvider>
  );
}
