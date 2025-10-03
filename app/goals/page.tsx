"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Plus, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGoals } from "@/lib/goals-context"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function GoalsPage() {
  const router = useRouter()
  const { goals, isLoading, deleteGoal } = useGoals()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteGoal(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error("[v0] Error deleting goal:", error)
    }
  }

  const calculateProgress = (goal: any) => {
    if (!goal.target_value || goal.target_value === 0) return 0
    return Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
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
            <span className="text-lg font-semibold">Mục Tiêu Remidi</span>
          </div>
          <Button size="sm" onClick={() => router.push("/add-goal")}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Active Goals */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Đang hoạt động</span>
                </div>

                {activeGoals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không có mục tiêu đang hoạt động</p>
                    <Button variant="link" className="text-primary mt-2" onClick={() => router.push("/add-goal")}>
                      Tạo mục tiêu mới!
                    </Button>
                  </div>
                ) : (
                  activeGoals.map((goal) => (
                    <Card key={goal.id} className="p-6 border-2 border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-primary">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {new Date(goal.start_date).toLocaleDateString("vi-VN")} -{" "}
                            {new Date(goal.end_date).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{calculateProgress(goal)}%</div>
                            <div className="text-xs text-muted-foreground">
                              {goal.current_value}/{goal.target_value} {goal.unit}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/edit-goal/${goal.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(goal.id)}
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Completed Goals */}
              {completedGoals.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-600">Đã hoàn thành</span>
                  </div>

                  {completedGoals.map((goal) => (
                    <Card key={goal.id} className="p-4 border opacity-75">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(goal.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            {goal.current_value}/{goal.target_value} {goal.unit}
                          </span>
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            100%
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <BottomNavigation />

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa mục tiêu?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Mục tiêu sẽ bị xóa vĩnh viễn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
