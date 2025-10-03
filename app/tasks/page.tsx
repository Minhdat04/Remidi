"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { TaskCalendar } from "@/components/task-calendar"
import { useRouter } from "next/navigation"
import { useTasks } from "@/lib/tasks-context"

export default function TasksPage() {
  const router = useRouter()
  const { tasks } = useTasks()

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
