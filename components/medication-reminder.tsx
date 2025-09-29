"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MedicationReminderProps {
  time: string
  onConfirm: () => void
}

export function MedicationReminder({ time, onConfirm }: MedicationReminderProps) {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-sm bg-primary border-0 shadow-none">
        <div className="p-8 text-center space-y-6">
          {/* Doctor Illustration */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <div className="text-6xl">👨‍⚕️</div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-primary-foreground text-balance">Take your medication for</h1>
            <div className="text-2xl font-bold text-primary-foreground">{time}</div>
          </div>

          {/* Progress Card */}
          <div className="bg-primary-foreground/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">💊</span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-primary-foreground">Take medicines</div>
                <div className="w-full bg-primary-foreground/20 rounded-full h-2 mt-2">
                  <div className="bg-primary-foreground h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="flex items-center justify-between text-xs text-primary-foreground/80 mt-1">
                  <span>NEXT PILL</span>
                  <span>17 Min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={onConfirm}
            className="w-full h-12 text-base font-medium bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Okay!
          </Button>
        </div>
      </Card>
    </div>
  )
}
