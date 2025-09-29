"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Notification {
  id: string
  type: "task" | "reminder" | "medicine" | "reward" | "contact" | "goal"
  title: string
  subtitle?: string
  time: string
  timestamp: Date
  read: boolean
  color: string
  icon: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "task",
      title: "Plant a tree",
      subtitle: "Ends in 28 Mins",
      time: "2 mins",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      color: "bg-green-100 text-green-600",
      icon: "🌳",
    },
    {
      id: "2",
      type: "reminder",
      title: "Update your remidi",
      subtitle: "Check your remidi status",
      time: "5 mins",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      color: "bg-blue-100 text-blue-600",
      icon: "📝",
    },
    {
      id: "3",
      type: "medicine",
      title: "Take your medicines",
      subtitle: "Starts in 1 hours",
      time: "10 mins",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      color: "bg-purple-100 text-purple-600",
      icon: "💊",
    },
    {
      id: "4",
      type: "task",
      title: "New task Created!",
      subtitle: "Plant a tree",
      time: "15 mins",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: true,
      color: "bg-orange-100 text-orange-600",
      icon: "✅",
    },
    {
      id: "5",
      type: "reward",
      title: "10 Coins Earned!",
      subtitle: "Congratulations! you've earned 50 coins for completing plant a tree",
      time: "20 mins",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      read: true,
      color: "bg-yellow-100 text-yellow-600",
      icon: "🪙",
    },
    {
      id: "6",
      type: "contact",
      title: "New Contact!",
      subtitle: "",
      time: "25 mins",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: true,
      color: "bg-indigo-100 text-indigo-600",
      icon: "👥",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
    console.log("[v0] New notification added:", newNotification)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Simulate periodic notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "medicine" as const,
          title: "Medication Reminder",
          subtitle: "Time to take your evening medication",
          time: "now",
          color: "bg-purple-100 text-purple-600",
          icon: "💊",
        },
        {
          type: "task" as const,
          title: "Daily Goal Progress",
          subtitle: "You're 80% complete with today's goals",
          time: "now",
          color: "bg-green-100 text-green-600",
          icon: "🎯",
        },
      ]

      if (Math.random() > 0.7) {
        // 30% chance every 30 seconds
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
