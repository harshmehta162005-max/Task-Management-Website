import type { ReactNode } from "react";

import { ShellProvider } from "@/components/shell/ShellProvider";
import { MobileSidebarSheet } from "@/components/shell/MobileSidebarSheet";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";

type WorkspaceLayoutProps = {
  children: ReactNode;
};

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <ShellProvider>
      <div className="workspace-bg flex h-dvh w-full overflow-x-hidden text-slate-900 dark:text-slate-100">
        <Sidebar />
        <MobileSidebarSheet />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">{children}</div>
        </div>
      </div>
    </ShellProvider>
  );
}
