"use client"

import { useState } from "react"
import { MedicationReminder } from "@/components/medication-reminder"
import { useRouter } from "next/navigation"

export default function ReminderPage() {
  const [showReminder, setShowReminder] = useState(true)
  const router = useRouter()

  const handleConfirm = () => {
    setShowReminder(false)
    router.push("/dashboard")
  }

  if (!showReminder) {
    return null
  }

  return <MedicationReminder time="1:00 pm" onConfirm={handleConfirm} />
}
