"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GoalsPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Remidi Goal</span>
          </div>
          <Button size="sm" onClick={() => router.push("/add-goal")}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Goal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>

            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌳</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary">Plant a Tree</h3>
                  <p className="text-sm text-muted-foreground">Health Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">60%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming Goals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-orange-600">Upcoming</span>
            </div>

            <div className="text-center py-8">
              <p className="text-muted-foreground">No Upcoming Goals to show</p>
              <Button variant="link" className="text-primary mt-2">
                Create More!
              </Button>
            </div>
          </div>

          {/* Completed Goals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>

            <Card className="p-4 border">
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">Join Goals</h3>
                <p className="text-sm text-muted-foreground">Perform</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">Plant a tree</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Repeat</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
