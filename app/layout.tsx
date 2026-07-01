import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import AppSidebar from "@/components/layout/app-sidebar";
import AppHeader from "@/components/layout/app-header";
import AppProviders from "@/components/layout/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Forge OS",
  description: "Relationship intelligence for builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} bg-zinc-950 text-white`}
      >
        <AppProviders>
          <AppSidebar />
          <AppHeader />

          <main className="min-h-screen pl-64 pt-16">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}