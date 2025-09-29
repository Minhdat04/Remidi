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

export default function AddGoalPage() {
  const [goalData, setGoalData] = useState({
    name: "",
    brief: "",
    tags: "",
  })

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Goal created:", goalData)
    router.push("/goals")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-semibold">Set Goal</span>
        </div>

        {/* Form */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goalName" className="text-sm font-medium text-primary">
                Goal
              </Label>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Add name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plant-tree">Plant a Tree</SelectItem>
                  <SelectItem value="lose-weight">Lose Weight</SelectItem>
                  <SelectItem value="exercise-daily">Exercise Daily</SelectItem>
                  <SelectItem value="drink-water">Drink More Water</SelectItem>
                  <SelectItem value="meditation">Daily Meditation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brief" className="text-sm font-medium text-primary">
                Brief
              </Label>
              <Textarea
                id="brief"
                placeholder="Why did you choose this goal ?"
                className="min-h-[100px]"
                value={goalData.brief}
                onChange={(e) => setGoalData((prev) => ({ ...prev, brief: e.target.value }))}
              />
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
                  value={goalData.tags}
                  onChange={(e) => setGoalData((prev) => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Button */}
        <div className="p-6">
          <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium">
            Create
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
