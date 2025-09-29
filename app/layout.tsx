import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/lib/notification-context"
import { ActivityProvider } from "@/lib/activity-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "REMIDI - Healthcare App",
  description: "Your personal healthcare companion for medication tracking and wellness goals",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <NotificationProvider>
              <ActivityProvider>{children}</ActivityProvider>
            </NotificationProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
