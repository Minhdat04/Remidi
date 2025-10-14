"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
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
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addTask = async (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  const deleteTask = async (id: string) => {
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
    // No-op for local state
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
