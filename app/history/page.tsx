"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActivity } from "@/lib/activity-context"

export default function HistoryPage() {
  const router = useRouter()
  const { activities, getCompletionRate, getTotalPoints, getActivitiesByDateRange } = useActivity()

  const completionRate = getCompletionRate()
  const totalPoints = getTotalPoints()
  const recentActivities = getActivitiesByDateRange(7)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600"
      case "missed":
        return "bg-red-100 text-red-600"
      case "pending":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓"
      case "missed":
        return "✗"
      case "pending":
        return "⏳"
      default:
        return "?"
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hôm nay"
    if (diffDays === 1) return "Hôm qua"
    if (diffDays <= 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold">Lịch Sử Remidi</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Card */}
          <Card className="bg-primary text-primary-foreground p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold">{completionRate}%</div>
              <div className="text-lg">Remidi đã hoàn thành</div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-primary-foreground/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold">Điểm</div>
                  <div className="text-sm opacity-80">{totalPoints}</div>
                </div>
                <div className="bg-primary-foreground/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold">Mục tiêu</div>
                  <div className="text-sm opacity-80">{activities.filter((a) => a.type === "goal").length}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* History Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lịch Sử</h2>
              <span className="text-sm text-muted-foreground">Xem trong 7 ngày qua</span>
            </div>

            {/* History Items */}
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Không có hoạt động gần đây</p>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}
                      >
                        <span className="text-sm">{getStatusIcon(activity.status)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(activity.date)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{activity.points || 0}</div>
                      <div
                        className={`text-xs capitalize ${activity.status === "completed" ? "text-green-600" : activity.status === "missed" ? "text-red-600" : "text-yellow-600"}`}
                      >
                        {activity.status === "completed"
                          ? "Hoàn thành"
                          : activity.status === "missed"
                            ? "Bỏ lỡ"
                            : "Đang chờ"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Updated Info */}
          <div className="text-center text-xs text-muted-foreground">Cập nhật vài giây trước</div>
        </div>

        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
