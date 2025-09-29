"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, User, Globe, Link } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const profileItems = [
    { icon: User, label: "Account", action: () => {} },
    { icon: Globe, label: "Language", action: () => {} },
    { icon: Link, label: "Connected Services", action: () => {} },
  ]

  const settingsItems = [
    { label: "Connected Services", toggle: true },
    { label: "About Us", action: () => {} },
    { label: "Terms & Conditions", action: () => {} },
    { label: "Logout", action: handleLogout, danger: true },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <Card className="bg-primary text-primary-foreground border-0 rounded-b-3xl">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="w-5 h-5 text-primary-foreground" />
              </Button>
              <span className="text-lg font-semibold">Profile</span>
            </div>

            {/* User Avatar */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold">User's Dashboard</h2>
              <p className="text-primary-foreground/80">+84 353540***</p>
            </div>
          </div>
        </Card>

        {/* Profile Options */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            {profileItems.map((item, index) => (
              <Button key={index} variant="ghost" className="w-full justify-between h-12 px-4" onClick={item.action}>
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connected Services</h3>

            <div className="space-y-2">
              {settingsItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <span className={`font-medium ${item.danger ? "text-destructive" : ""}`}>{item.label}</span>
                  {item.toggle ? (
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={item.action}
                      className={item.danger ? "text-destructive hover:text-destructive" : ""}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
