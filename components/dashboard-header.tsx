"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useActivity } from "@/lib/activity-context"

export function DashboardHeader() {
  const { user } = useAuth()
  const { getCompletionRate, getTotalPoints } = useActivity()

  const completionRate = getCompletionRate()
  const totalPoints = getTotalPoints()

  return (
    <Card className="bg-primary text-primary-foreground border-0 rounded-b-3xl">
      <div className="p-6 space-y-4">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user ? `${user.firstName}'s Dashboard` : "User's Dashboard"}</h2>
              <p className="text-primary-foreground/80 text-sm">+84 353540***</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Star className="w-5 h-5" />
          </Button>
        </div>

        {/* Welcome Message */}
        <div className="bg-primary-foreground/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-foreground/30 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold">📋</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Take medicines</span>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="w-full bg-primary-foreground/20 rounded-full h-2 mb-2">
                <div className="bg-primary-foreground h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-foreground/80">08 JUL 2022</span>
                <span className="font-medium">15 Min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-sm text-primary-foreground/80">Remidi Goals</div>
            <div className="text-xs text-primary-foreground/60">Plant a tree</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm text-primary-foreground/80">Total Points</div>
            <div className="text-xs text-primary-foreground/60">Keep it up!</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
