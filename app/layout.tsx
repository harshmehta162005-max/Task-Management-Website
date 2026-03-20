import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus — AI-Native Team Operating System",
  description: "Manage projects, assign tasks, automate follow-ups, and ask AI for instant clarity — all from one intelligent workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${manrope.variable} ${inter.variable} font-display min-h-screen bg-gradient-to-b from-[#eef2fb] via-[#e8ecf7] to-[#e1e5f2] dark:from-[#0b1020] dark:via-[#090d19] dark:to-[#05070f] text-slate-900 dark:text-slate-100 antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

