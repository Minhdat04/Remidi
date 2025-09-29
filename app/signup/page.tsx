"use client"

import { AuthForm } from "@/components/auth-form"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  return <AuthForm type="signup" onBack={handleBack} />
}
