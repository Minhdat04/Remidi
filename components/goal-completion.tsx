"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface GoalCompletionProps {
  onContinue: () => void
}

export function GoalCompletion({ onContinue }: GoalCompletionProps) {
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
            <h1 className="text-xl font-semibold text-primary-foreground text-balance">Congratulations !!!</h1>
            <h2 className="text-lg text-primary-foreground text-balance">Your Remidi is completed</h2>
          </div>

          {/* Reward Section */}
          <div className="bg-primary-foreground/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-2xl font-bold text-primary-foreground">Plant A Tree</h3>

            <div className="w-24 h-24 bg-primary-foreground/20 rounded-full mx-auto flex items-center justify-center">
              <div className="text-4xl">🌳</div>
            </div>

            <div className="w-20 h-20 bg-primary-foreground/20 rounded-full mx-auto flex items-center justify-center">
              <div className="text-2xl font-bold text-primary-foreground">100%</div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full h-12 text-base font-medium bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  )
}
