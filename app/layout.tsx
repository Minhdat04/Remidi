import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/lib/notification-context"
import { ActivityProvider } from "@/lib/activity-context"
import { GoalsProvider } from "@/lib/goals-context"
import { MedicationsProvider } from "@/lib/medications-context"
import { TasksProvider } from "@/lib/tasks-context"
import { RemindersProvider } from "@/lib/reminders-context"
import { ProgressProvider } from "@/lib/progress-context"
import { Suspense } from "react"
import vi from "@/lib/localization"

export const metadata: Metadata = {
  title: vi.app.title,
  description: vi.app.description,
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>{vi.common.loading}</div>}>
          <AuthProvider>
            <GoalsProvider>
              <MedicationsProvider>
                <TasksProvider>
                  <NotificationProvider>
                    <RemindersProvider>
                      <ProgressProvider>
                        <ActivityProvider>{children}</ActivityProvider>
                      </ProgressProvider>
                    </RemindersProvider>
                  </NotificationProvider>
                </TasksProvider>
              </MedicationsProvider>
            </GoalsProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
