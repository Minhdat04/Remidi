"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTasks } from "@/lib/tasks-context"
import { useGoals } from "@/lib/goals-context"
import { useToast } from "@/hooks/use-toast"

export default function AddTaskPage() {
  const [taskData, setTaskData] = useState({
    remidi: "medicines",
    date: "",
    time: "",
    brief: "",
    linkTo: "Goals",
    linkedGoalId: "",
    tags: "",
  })

  const router = useRouter()
  const { addTask } = useTasks()
  const { goals } = useGoals()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskData.remidi || !taskData.date) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      })
      return
    }

    try {
      await addTask({
        title: taskData.remidi,
        description: taskData.brief,
        task_type: taskData.remidi,
        due_date: taskData.date,
        due_time: taskData.time,
        linked_goal_id: taskData.linkTo === "Goals" ? taskData.linkedGoalId : undefined,
        tags: taskData.tags ? taskData.tags.split(",").map((t) => t.trim()) : [],
        is_completed: false,
      })

      toast({
        title: "Thành công",
        description: "Đã thêm nhiệm vụ mới",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error creating task:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold">Chọn Remidi</span>
        </div>

        {/* Form */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="remidi" className="text-sm font-medium text-primary">
                Remidi
              </Label>
              <Select
                value={taskData.remidi}
                onValueChange={(value) => setTaskData((prev) => ({ ...prev, remidi: value }))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Uống thuốc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicines">Uống thuốc</SelectItem>
                  <SelectItem value="exercise">Tập thể dục</SelectItem>
                  <SelectItem value="water">Uống nước</SelectItem>
                  <SelectItem value="checkup">Khám bệnh</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-primary">
                Ngày
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  className="h-12"
                  value={taskData.date}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-primary">
                Giờ
              </Label>
              <Input
                id="time"
                type="time"
                className="h-12"
                value={taskData.time}
                onChange={(e) => setTaskData((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brief" className="text-sm font-medium text-primary">
                Mô Tả
              </Label>
              <Textarea
                id="brief"
                placeholder="Remidi này về điều gì?"
                className="min-h-[80px]"
                value={taskData.brief}
                onChange={(e) => setTaskData((prev) => ({ ...prev, brief: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">Liên kết đến</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={taskData.linkTo === "None" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setTaskData((prev) => ({ ...prev, linkTo: "None", linkedGoalId: "" }))}
                >
                  Không
                </Button>
                <Button
                  type="button"
                  variant={taskData.linkTo === "Goals" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setTaskData((prev) => ({ ...prev, linkTo: "Goals" }))}
                >
                  Mục tiêu
                </Button>
              </div>
            </div>

            {taskData.linkTo === "Goals" && goals.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm font-medium text-primary">
                  Chọn Mục Tiêu
                </Label>
                <Select
                  value={taskData.linkedGoalId}
                  onValueChange={(value) => setTaskData((prev) => ({ ...prev, linkedGoalId: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Chọn mục tiêu" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-primary">
                Thẻ
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tags"
                  placeholder="Thêm thẻ (phân cách bằng dấu phẩy)"
                  className="h-12"
                  value={taskData.tags}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Button */}
        <div className="p-6">
          <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium">
            Tạo Nhiệm Vụ
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
