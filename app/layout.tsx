import type { Metadata } from "next"
import "./globals.css"
import AppSidebar from "../components/layout/app-sidebar"
import AppHeader from "../components/layout/app-header"

export const metadata: Metadata = {
  title: "Forge OS",
  description: "Relationship intelligence for builders.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950">
        <AppSidebar />
        <AppHeader />
        <main className="min-h-screen pl-64 pt-16 text-white">
          {children}
        </main>
      </body>
    </html>
  )
}