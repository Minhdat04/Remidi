"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Goal } from "@/lib/types/database"

interface GoalsContextType {
  goals: Goal[]
  isLoading: boolean
  createGoal: (goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  getGoalById: (id: string) => Goal | undefined
  refreshGoals: () => Promise<void>
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined)

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const createGoal = async (goalData: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setGoals((prev) => [newGoal, ...prev])
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) throw new Error("User not authenticated")

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : goal,
      ),
    )
  }

  const deleteGoal = async (id: string) => {
    if (!user) throw new Error("User not authenticated")
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const getGoalById = (id: string) => {
    return goals.find((goal) => goal.id === id)
  }

  const refreshGoals = async () => {
    // No-op for local state
  }

  return (
    <GoalsContext.Provider
      value={{
        goals,
        isLoading,
        createGoal,
        updateGoal,
        deleteGoal,
        getGoalById,
        refreshGoals,
      }}
    >
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const context = useContext(GoalsContext)
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider")
  }
  return context
}
