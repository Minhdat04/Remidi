"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useAuth } from "./auth-context"
import { useNotifications } from "./notification-context"

export interface Reminder {
  id: string
  user_id: string
  reminder_type: "medication" | "task" | "goal" | "custom"
  related_id?: string
  title: string
  description?: string
  reminder_time: string
  is_recurring: boolean
  recurrence_pattern?: string
  is_active: boolean
  last_triggered_at?: string
  created_at: string
  updated_at: string
}

interface RemindersContextType {
  reminders: Reminder[]
  loading: boolean
  addReminder: (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  toggleReminderActive: (id: string) => Promise<void>
  refreshReminders: () => Promise<void>
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined)

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchReminders = async () => {
    if (!user) {
      setReminders([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_time", { ascending: true })

      if (error) throw error
      setReminders(data || [])
    } catch (error) {
      console.error("[v0] Error fetching reminders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [user])

  // Check for due reminders every minute
  useEffect(() => {
    if (!user) return

    const checkReminders = () => {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

      reminders.forEach((reminder) => {
        if (!reminder.is_active) return

        const reminderTime = new Date(reminder.reminder_time).toTimeString().slice(0, 5)

        // Check if reminder is due
        if (reminderTime === currentTime) {
          const lastTriggered = reminder.last_triggered_at ? new Date(reminder.last_triggered_at) : null
          const shouldTrigger = !lastTriggered || now.getTime() - lastTriggered.getTime() > 60000 // 1 minute

          if (shouldTrigger) {
            // Trigger notification
            addNotification({
              type: reminder.reminder_type === "medication" ? "medicine" : "reminder",
              title: reminder.title,
              subtitle: reminder.description,
              time: "now",
              color:
                reminder.reminder_type === "medication" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600",
              icon: reminder.reminder_type === "medication" ? "💊" : "🔔",
            })

            // Update last triggered time
            updateReminder(reminder.id, { last_triggered_at: now.toISOString() })
          }
        }
      })
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    checkReminders() // Check immediately

    return () => clearInterval(interval)
  }, [reminders, user])

  const addReminder = async (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("reminders")
      .insert([{ ...reminder, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    setReminders((prev) => [data, ...prev])
  }

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const { data, error } = await supabase.from("reminders").update(updates).eq("id", id).select().single()

    if (error) throw error
    setReminders((prev) => prev.map((reminder) => (reminder.id === id ? data : reminder)))
  }

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id)

    if (error) throw error
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const toggleReminderActive = async (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder) return

    await updateReminder(id, { is_active: !reminder.is_active })
  }

  const refreshReminders = async () => {
    await fetchReminders()
  }

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        loading,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminderActive,
        refreshReminders,
      }}
    >
      {children}
    </RemindersContext.Provider>
  )
}

export function useReminders() {
  const context = useContext(RemindersContext)
  if (context === undefined) {
    throw new Error("useReminders must be used within a RemindersProvider")
  }
  return context
}
