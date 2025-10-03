"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Plus, ChevronRight } from "lucide-react"
import { useState } from "react"

interface TaskCalendarProps {
  onBack?: () => void
  onAddTask?: () => void
}

export function TaskCalendar({ onBack, onAddTask }: TaskCalendarProps) {
  const [selectedView, setSelectedView] = useState<"Day" | "Week" | "Month">("Day")
  const [selectedDate, setSelectedDate] = useState(10)

  const viewButtons = [
    { key: "Day" as const, label: "Ngày" },
    { key: "Week" as const, label: "Tuần" },
    { key: "Month" as const, label: "Tháng" },
  ]

  const dates = [
    { date: 8, day: "T2" },
    { date: 9, day: "T3" },
    { date: 10, day: "T4" },
    { date: 11, day: "T5" },
    { date: 12, day: "T6" },
  ]

  const tasks = [
    {
      id: 1,
      title: "Uống thuốc",
      description: "Uống thuốc hàng ngày đúng giờ. Không bỏ liều nào. Uống cùng với nước.",
      status: "active",
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold">Remidi</span>
        </div>
        <Button size="sm" onClick={onAddTask}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* View Toggle */}
      <div className="p-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {viewButtons.map((view) => (
            <Button
              key={view.key}
              variant={selectedView === view.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView(view.key)}
              className="flex-1 h-8"
            >
              {view.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          {dates.map((item) => (
            <Button
              key={item.date}
              variant={selectedDate === item.date ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDate(item.date)}
              className="flex-1 h-16 flex-col gap-1"
            >
              <span className="text-xs">{item.day}</span>
              <span className="text-lg font-semibold">{item.date}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 px-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-600">Đang hoạt động</span>
        </div>

        {tasks.map((task) => (
          <Card key={task.id} className="p-4 border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{task.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {/* Add More Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-orange-600">Thêm</span>
          </div>

          <Card className="p-4 border-dashed border-2 border-muted">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-muted rounded-xl mx-auto flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Thêm nhiệm vụ</p>
              <Button variant="link" className="text-primary p-0 h-auto">
                Tạo thêm!
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
