"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useAuth } from "./auth-context"

interface Activity {
  id: string
  user_id?: string
  type: "medicine" | "goal" | "task" | "reward"
  title: string
  description?: string
  status: "completed" | "missed" | "pending"
  date: Date
  points?: number
  created_at?: string
}

interface ActivityContextType {
  activities: Activity[]
  loading: boolean
  addActivity: (activity: Omit<Activity, "id" | "user_id" | "created_at">) => Promise<void>
  getActivitiesByDateRange: (days: number) => Activity[]
  getCompletionRate: () => number
  getTotalPoints: () => number
  refreshActivities: () => Promise<void>
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addActivity = async (activityData: Omit<Activity, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated")

    const newActivity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
    }

    setActivities((prev) => [newActivity, ...prev])
  }

  const getActivitiesByDateRange = (days: number) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return activities.filter((activity) => activity.date >= cutoffDate)
  }

  const getCompletionRate = () => {
    const recentActivities = getActivitiesByDateRange(7)
    const completed = recentActivities.filter((a) => a.status === "completed").length
    const total = recentActivities.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getTotalPoints = () => {
    return activities.reduce((total, activity) => total + (activity.points || 0), 0)
  }

  const refreshActivities = async () => {
    // No-op for local state
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        addActivity,
        getActivitiesByDateRange,
        getCompletionRate,
        getTotalPoints,
        refreshActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider")
  }
  return context
}
