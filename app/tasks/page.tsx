"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { TaskCalendar } from "@/components/task-calendar"
import { useRouter } from "next/navigation"

export default function TasksPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleAddTask = () => {
    router.push("/add-task")
  }

  return (
    <ProtectedRoute>
      <TaskCalendar onBack={handleBack} onAddTask={handleAddTask} />
    </ProtectedRoute>
  )
}
