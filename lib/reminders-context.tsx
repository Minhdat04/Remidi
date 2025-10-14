"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  // Check for due reminders every minute
  useEffect(() => {
    if (!user) return

    const checkReminders = () => {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

      reminders.forEach((reminder) => {
        if (!reminder.is_active) return

        const reminderTime = new Date(reminder.reminder_time).toTimeString().slice(0, 5)

        if (reminderTime === currentTime) {
          const lastTriggered = reminder.last_triggered_at ? new Date(reminder.last_triggered_at) : null
          const shouldTrigger = !lastTriggered || now.getTime() - lastTriggered.getTime() > 60000

          if (shouldTrigger) {
            addNotification({
              type: reminder.reminder_type === "medication" ? "medicine" : "reminder",
              title: reminder.title,
              subtitle: reminder.description,
              time: "now",
              color:
                reminder.reminder_type === "medication" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600",
              icon: reminder.reminder_type === "medication" ? "💊" : "🔔",
            })

            updateReminder(reminder.id, { last_triggered_at: now.toISOString() })
          }
        }
      })
    }

    const interval = setInterval(checkReminders, 60000)
    checkReminders()

    return () => clearInterval(interval)
  }, [reminders, user])

  const addReminder = async (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const newReminder: Reminder = {
      ...reminder,
      id: `reminder-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setReminders((prev) => [newReminder, ...prev])
  }

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : reminder,
      ),
    )
  }

  const deleteReminder = async (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const toggleReminderActive = async (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder) return

    await updateReminder(id, { is_active: !reminder.is_active })
  }

  const refreshReminders = async () => {
    // No-op for local state
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
