"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import vi from "@/lib/localization"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        <DashboardHeader />

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-card rounded-2xl p-4 border h-auto flex-col gap-2"
              onClick={() => router.push("/add-medicine")}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="font-medium text-sm">{vi.dashboard.addMedicine}</h3>
              <p className="text-xs text-muted-foreground">{vi.dashboard.trackMedications}</p>
            </Button>

            <Button
              variant="outline"
              className="bg-card rounded-2xl p-4 border h-auto flex-col gap-2"
              onClick={() => router.push("/add-goal")}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-medium text-sm">{vi.dashboard.setGoal}</h3>
              <p className="text-xs text-muted-foreground">{vi.dashboard.createHealthGoals}</p>
            </Button>
          </div>

          {/* Today's Tasks */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{vi.dashboard.todaysTasks}</h2>

            <div className="bg-card rounded-2xl p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-lg">💊</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Uống thuốc buổi sáng</h3>
                  <p className="text-sm text-muted-foreground">
                    {vi.dashboard.dueIn} 2 {vi.dashboard.hours}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">8:00 {vi.time.am}</div>
                  <div className="text-xs text-muted-foreground">{vi.common.pending}</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Uống nước</h3>
                  <p className="text-sm text-muted-foreground">{vi.common.completed}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">7:00 {vi.time.am}</div>
                  <div className="text-xs text-muted-foreground">{vi.common.done}</div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 border-muted text-muted-foreground bg-transparent"
              onClick={() => router.push("/add-task")}
            >
              + {vi.dashboard.addTask}
            </Button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
