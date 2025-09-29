"use client"

import { GoalCompletion } from "@/components/goal-completion"
import { useRouter } from "next/navigation"

export default function GoalCompletionPage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return <GoalCompletion onContinue={handleContinue} />
}
