"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
  const [isLoading, setIsLoading] = useState(true)
  const { supabaseUser } = useAuth()
  const supabase = createClient()

  const fetchGoals = async () => {
    if (!supabaseUser) {
      setGoals([])
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setGoals(data || [])
    } catch (error) {
      console.error("[v0] Error fetching goals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [supabaseUser])

  const createGoal = async (goalData: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!supabaseUser) throw new Error("User not authenticated")

    try {
      const { data, error } = await supabase
        .from("goals")
        .insert({
          ...goalData,
          user_id: supabaseUser.id,
        })
        .select()
        .single()

      if (error) throw error

      setGoals((prev) => [data, ...prev])
      console.log("[v0] Goal created:", data)
    } catch (error) {
      console.error("[v0] Error creating goal:", error)
      throw error
    }
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!supabaseUser) throw new Error("User not authenticated")

    try {
      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .eq("user_id", supabaseUser.id)
        .select()
        .single()

      if (error) throw error

      setGoals((prev) => prev.map((goal) => (goal.id === id ? data : goal)))
      console.log("[v0] Goal updated:", data)
    } catch (error) {
      console.error("[v0] Error updating goal:", error)
      throw error
    }
  }

  const deleteGoal = async (id: string) => {
    if (!supabaseUser) throw new Error("User not authenticated")

    try {
      const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", supabaseUser.id)

      if (error) throw error

      setGoals((prev) => prev.filter((goal) => goal.id !== id))
      console.log("[v0] Goal deleted:", id)
    } catch (error) {
      console.error("[v0] Error deleting goal:", error)
      throw error
    }
  }

  const getGoalById = (id: string) => {
    return goals.find((goal) => goal.id === id)
  }

  const refreshGoals = async () => {
    await fetchGoals()
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
