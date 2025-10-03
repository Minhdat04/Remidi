"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
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
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchActivities = async () => {
    if (!user) {
      setActivities([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("activity_history")
        .select("*")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: false })

      if (error) throw error

      // Transform data to match Activity interface
      const transformedData: Activity[] =
        data?.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          type: item.activity_type as "medicine" | "goal" | "task" | "reward",
          title: item.title,
          description: item.description,
          status: item.status as "completed" | "missed" | "pending",
          date: new Date(item.activity_date),
          points: item.points_earned,
          created_at: item.created_at,
        })) || []

      setActivities(transformedData)
    } catch (error) {
      console.error("[v0] Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [user])

  const addActivity = async (activityData: Omit<Activity, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("activity_history")
      .insert([
        {
          user_id: user.id,
          activity_type: activityData.type,
          title: activityData.title,
          description: activityData.description,
          status: activityData.status,
          activity_date: activityData.date.toISOString(),
          points_earned: activityData.points || 0,
        },
      ])
      .select()
      .single()

    if (error) throw error

    const newActivity: Activity = {
      id: data.id,
      user_id: data.user_id,
      type: data.activity_type,
      title: data.title,
      description: data.description,
      status: data.status,
      date: new Date(data.activity_date),
      points: data.points_earned,
      created_at: data.created_at,
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

  const refreshActivities = async () => {
    await fetchActivities()
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
