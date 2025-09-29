"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface Activity {
  id: string
  type: "medicine" | "goal" | "task" | "reward"
  title: string
  description?: string
  status: "completed" | "missed" | "pending"
  date: Date
  points?: number
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id">) => void
  getActivitiesByDateRange: (days: number) => Activity[]
  getCompletionRate: () => number
  getTotalPoints: () => number
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "medicine",
      title: "Take Medicines",
      status: "completed",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      points: 10,
    },
    {
      id: "2",
      type: "medicine",
      title: "Take Medicines",
      status: "missed",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      points: 0,
    },
    {
      id: "3",
      type: "medicine",
      title: "Take Medicines",
      status: "completed",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      points: 10,
    },
    {
      id: "4",
      type: "goal",
      title: "Plant a Tree",
      status: "completed",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      points: 50,
    },
    {
      id: "5",
      type: "task",
      title: "Drink Water",
      status: "completed",
      date: new Date(),
      points: 5,
    },
  ])

  const addActivity = (activityData: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    }

    setActivities((prev) => [newActivity, ...prev])
    console.log("[v0] New activity added:", newActivity)
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

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        getActivitiesByDateRange,
        getCompletionRate,
        getTotalPoints,
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
