"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import vi from "@/lib/localization"

interface OnboardingScreenProps {
  title: string
  description: string
  icon: React.ReactNode
  onNext?: () => void
  onSkip?: () => void
  showSkip?: boolean
  nextText?: string
  currentStep: number
  totalSteps: number
}

export function OnboardingScreen({
  title,
  description,
  icon,
  onNext,
  onSkip,
  showSkip = true,
  nextText = vi.common.next, // Use Vietnamese default text
  currentStep,
  totalSteps,
}: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{"</>"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <Card className="w-full max-w-sm bg-card border-0 shadow-none">
          <div className="p-8 text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">{icon}</div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-foreground text-balance">{title}</h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed text-balance">{description}</p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentStep - 1 ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Button onClick={onNext} className="w-full h-12 text-base font-medium">
          {nextText}
        </Button>

        {showSkip && (
          <Button variant="ghost" onClick={onSkip} className="w-full h-12 text-base font-medium text-muted-foreground">
            {vi.common.skip}
          </Button>
        )}
      </div>
    </div>
  )
}
