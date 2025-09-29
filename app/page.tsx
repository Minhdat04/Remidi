"use client"

import { useState } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { FileText, Heart, HandHeart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import vi from "@/lib/localization"

type Screen = "onboarding-1" | "onboarding-2" | "onboarding-3"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding-1")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleNext = () => {
    switch (currentScreen) {
      case "onboarding-1":
        setCurrentScreen("onboarding-2")
        break
      case "onboarding-2":
        setCurrentScreen("onboarding-3")
        break
      case "onboarding-3":
        router.push("/signup")
        break
      default:
        break
    }
  }

  const handleSkip = () => {
    router.push("/signup")
  }

  if (currentScreen === "onboarding-1") {
    return (
      <OnboardingScreen
        title={vi.onboarding.screen1.title}
        description={vi.onboarding.screen1.description}
        icon={<FileText className="w-12 h-12 text-primary-foreground" />}
        onNext={handleNext}
        onSkip={handleSkip}
        currentStep={1}
        totalSteps={3}
      />
    )
  }

  if (currentScreen === "onboarding-2") {
    return (
      <OnboardingScreen
        title={vi.onboarding.screen2.title}
        description={vi.onboarding.screen2.description}
        icon={<Heart className="w-12 h-12 text-primary-foreground" />}
        onNext={handleNext}
        onSkip={handleSkip}
        currentStep={2}
        totalSteps={3}
        nextText={vi.common.skip}
      />
    )
  }

  if (currentScreen === "onboarding-3") {
    return (
      <OnboardingScreen
        title={vi.onboarding.screen3.title}
        description={vi.onboarding.screen3.description}
        icon={<HandHeart className="w-12 h-12 text-primary-foreground" />}
        onNext={handleNext}
        onSkip={handleSkip}
        showSkip={false}
        nextText={vi.common.next}
        currentStep={3}
        totalSteps={3}
      />
    )
  }

  return null
}
