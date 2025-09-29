"use client"

import { Button } from "@/components/ui/button"
import { Home, User, Target, History, Bell, Plus } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useNotifications } from "@/lib/notification-context"
import vi from "@/lib/localization"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { unreadCount } = useNotifications()

  const navItems = [
    { icon: Home, label: vi.navigation.home, path: "/dashboard" },
    { icon: Target, label: vi.navigation.goals, path: "/goals" },
    { icon: History, label: vi.navigation.history, path: "/history" },
    { icon: Bell, label: vi.navigation.notifications, path: "/notifications", badge: unreadCount },
    { icon: User, label: vi.navigation.profile, path: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          if (index === 2) {
            // Add button in the middle
            return (
              <div key="add" className="flex flex-col items-center">
                <Button
                  size="sm"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => router.push("/tasks")}
                >
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </Button>
              </div>
            )
          }

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => router.push(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </div>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
