"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
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
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addProgress = async (progress: Omit<Progress, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated")

    const newProgress: Progress = {
      ...progress,
      id: `progress-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
    }

    setProgressRecords((prev) => [newProgress, ...prev])
  }

  const getProgressByGoal = (goalId: string) => {
    return progressRecords.filter((p) => p.goal_id === goalId)
  }

  const getProgressByMetric = (metricName: string) => {
    return progressRecords.filter((p) => p.metric_name === metricName)
  }

  const deleteProgress = async (id: string) => {
    setProgressRecords((prev) => prev.filter((p) => p.id !== id))
  }

  const refreshProgress = async () => {
    // No-op for local state
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
