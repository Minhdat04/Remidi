"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddTaskPage() {
  const [taskData, setTaskData] = useState({
    remidi: "",
    date: "",
    time: "",
    brief: "",
    linkTo: "Goals",
    tags: "",
  })

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Task created:", taskData)
    router.push("/dashboard")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold">Choose Remidi</span>
        </div>

        {/* Form */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="remidi" className="text-sm font-medium text-primary">
                Remidi
              </Label>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Take Medicines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicines">Take Medicines</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="water">Drink Water</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="datetime" className="text-sm font-medium text-primary">
                Date & Time
              </Label>
              <div className="relative">
                <Input
                  id="datetime"
                  placeholder="DD-MM-YYYY"
                  className="h-12 pr-10"
                  value={taskData.date}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, date: e.target.value }))}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brief" className="text-sm font-medium text-primary">
                Brief
              </Label>
              <Textarea
                id="brief"
                placeholder="What is the Remidi about?"
                className="min-h-[80px]"
                value={taskData.brief}
                onChange={(e) => setTaskData((prev) => ({ ...prev, brief: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">Link to</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  onClick={() => setTaskData((prev) => ({ ...prev, linkTo: "None" }))}
                >
                  None
                </Button>
                <Button
                  type="button"
                  variant={taskData.linkTo === "Goals" ? "default" : "outline"}
                  className="flex-1 h-12"
                  onClick={() => setTaskData((prev) => ({ ...prev, linkTo: "Goals" }))}
                >
                  Goals
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-primary">
                Tags
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tags"
                  placeholder="Add +"
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
            Next
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
