"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MoreHorizontal, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/lib/notification-context"
import { useEffect } from "react"

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications()

  // Mark notifications as read when viewed
  useEffect(() => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    unreadIds.forEach((id) => markAsRead(id))
  }, [notifications, markAsRead])

  const handleClearAll = () => {
    clearAll()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Notifications</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear All
            <MoreHorizontal className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3">
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600">
                {notifications.filter((n) => !n.read).length > 0 ? "Unread Notifications" : "All Notifications"}
              </span>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  notification.read ? "bg-card" : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notification.color}`}>
                  <span className="text-lg">{notification.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${!notification.read ? "text-primary" : ""}`}>
                        {notification.title}
                      </h3>
                      {notification.subtitle && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                      {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
