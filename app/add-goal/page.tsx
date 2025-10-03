"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGoals } from "@/lib/goals-context"

export default function AddGoalPage() {
  const { createGoal } = useGoals()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [goalData, setGoalData] = useState({
    title: "",
    description: "",
    target_value: "",
    current_value: "0",
    unit: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    status: "active" as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await createGoal({
        title: goalData.title,
        description: goalData.description || null,
        target_value: Number.parseInt(goalData.target_value) || null,
        current_value: Number.parseInt(goalData.current_value) || 0,
        unit: goalData.unit || null,
        start_date: goalData.start_date,
        end_date: goalData.end_date,
        status: goalData.status,
      })

      console.log("[v0] Goal created successfully")
      router.push("/goals")
    } catch (err: any) {
      console.error("[v0] Error creating goal:", err)
      setError(err?.message || "Không thể tạo mục tiêu. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
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
          <span className="text-lg font-semibold">Đặt Mục Tiêu</span>
        </div>

        {/* Form */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-primary">
                Tên Mục Tiêu *
              </Label>
              <Input
                id="title"
                placeholder="Ví dụ: Giảm cân, Tập thể dục..."
                className="h-12"
                value={goalData.title}
                onChange={(e) => setGoalData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-primary">
                Mô Tả
              </Label>
              <Textarea
                id="description"
                placeholder="Tại sao bạn chọn mục tiêu này?"
                className="min-h-[100px]"
                value={goalData.description}
                onChange={(e) => setGoalData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_value" className="text-sm font-medium text-primary">
                  Mục Tiêu *
                </Label>
                <Input
                  id="target_value"
                  type="number"
                  placeholder="100"
                  className="h-12"
                  value={goalData.target_value}
                  onChange={(e) => setGoalData((prev) => ({ ...prev, target_value: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium text-primary">
                  Đơn Vị *
                </Label>
                <Input
                  id="unit"
                  placeholder="kg, lần, phút..."
                  className="h-12"
                  value={goalData.unit}
                  onChange={(e) => setGoalData((prev) => ({ ...prev, unit: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-medium text-primary">
                  Ngày Bắt Đầu *
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  className="h-12"
                  value={goalData.start_date}
                  onChange={(e) => setGoalData((prev) => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-medium text-primary">
                  Ngày Kết Thúc *
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  className="h-12"
                  value={goalData.end_date}
                  onChange={(e) => setGoalData((prev) => ({ ...prev, end_date: e.target.value }))}
                  min={goalData.start_date}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Button */}
        <div className="p-6">
          <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo Mục Tiêu"}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
