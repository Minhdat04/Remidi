"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useAuth } from "./auth-context"

export interface Progress {
  id: string
  user_id: string
  goal_id?: string
  metric_name: string
  metric_value: number
  metric_unit?: string
  recorded_date: string
  notes?: string
  created_at: string
}

interface ProgressContextType {
  progressRecords: Progress[]
  loading: boolean
  addProgress: (progress: Omit<Progress, "id" | "user_id" | "created_at">) => Promise<void>
  getProgressByGoal: (goalId: string) => Progress[]
  getProgressByMetric: (metricName: string) => Progress[]
  deleteProgress: (id: string) => Promise<void>
  refreshProgress: () => Promise<void>
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progressRecords, setProgressRecords] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchProgress = async () => {
    if (!user) {
      setProgressRecords([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_date", { ascending: false })

      if (error) throw error
      setProgressRecords(data || [])
    } catch (error) {
      console.error("[v0] Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [user])

  const addProgress = async (progress: Omit<Progress, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("progress_tracking")
      .insert([{ ...progress, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    setProgressRecords((prev) => [data, ...prev])
  }

  const getProgressByGoal = (goalId: string) => {
    return progressRecords.filter((p) => p.goal_id === goalId)
  }

  const getProgressByMetric = (metricName: string) => {
    return progressRecords.filter((p) => p.metric_name === metricName)
  }

  const deleteProgress = async (id: string) => {
    const { error } = await supabase.from("progress_tracking").delete().eq("id", id)

    if (error) throw error
    setProgressRecords((prev) => prev.filter((p) => p.id !== id))
  }

  const refreshProgress = async () => {
    await fetchProgress()
  }

  return (
    <ProgressContext.Provider
      value={{
        progressRecords,
        loading,
        addProgress,
        getProgressByGoal,
        getProgressByMetric,
        deleteProgress,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
