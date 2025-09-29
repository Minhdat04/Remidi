"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
              <h3 className="font-medium text-sm">Add Medicine</h3>
              <p className="text-xs text-muted-foreground">Track your medications</p>
            </Button>

            <Button
              variant="outline"
              className="bg-card rounded-2xl p-4 border h-auto flex-col gap-2"
              onClick={() => router.push("/add-goal")}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-medium text-sm">Set Goal</h3>
              <p className="text-xs text-muted-foreground">Create health goals</p>
            </Button>
          </div>

          {/* Today's Tasks */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Today's Tasks</h2>

            <div className="bg-card rounded-2xl p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-lg">💊</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Take Morning Medication</h3>
                  <p className="text-sm text-muted-foreground">Due in 2 hours</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">8:00 AM</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Drink Water</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">7:00 AM</div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 border-muted text-muted-foreground bg-transparent"
              onClick={() => router.push("/add-task")}
            >
              + Add More Tasks
            </Button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
