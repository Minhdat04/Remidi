"use client"

import { AuthForm } from "@/components/auth-form"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  return <AuthForm type="signin" onBack={handleBack} />
}
