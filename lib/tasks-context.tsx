"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useAuth } from "./auth-context"

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  task_type: string
  due_date: string
  due_time?: string
  linked_goal_id?: string
  tags?: string[]
  is_completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

interface TasksContextType {
  tasks: Task[]
  loading: boolean
  addTask: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskComplete: (id: string) => Promise<void>
  refreshTasks: () => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchTasks = async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("[v0] Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const addTask = async (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...task, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    setTasks((prev) => [data, ...prev])
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()

    if (error) throw error
    setTasks((prev) => prev.map((task) => (task.id === id ? data : task)))
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) throw error
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const updates: Partial<Task> = {
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : undefined,
    }

    await updateTask(id, updates)
  }

  const refreshTasks = async () => {
    await fetchTasks()
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        refreshTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}
