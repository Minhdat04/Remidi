"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, User } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import vi from "@/lib/localization"

interface AuthFormProps {
  type: "signup" | "signin"
  onBack?: () => void
}

export function AuthForm({ type, onBack }: AuthFormProps) {
  const { login, signup, socialLogin, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
  })

  const [error, setError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (type === "signup") {
        await signup(formData)
        setSignupSuccess(true)
      } else {
        await login(formData.email, formData.password)
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err?.message || "Xác thực thất bại. Vui lòng thử lại.")
      console.error("[v0] Auth error:", err)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    try {
      await socialLogin(provider)
      router.push("/dashboard")
    } catch (err) {
      setError("Đăng nhập mạng xã hội thất bại. Vui lòng thử lại.")
      console.error("[v0] Social login error:", err)
    }
  }

  const handleToggleMode = () => {
    if (type === "signup") {
      router.push("/signin")
    } else {
      router.push("/signup")
    }
  }

  const isSignup = type === "signup"

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-medium text-primary">Đăng ký thành công</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <Card className="w-full max-w-sm bg-card border-0 shadow-none">
            <div className="p-6 space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Kiểm tra email của bạn</h2>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi đã gửi một email xác nhận đến <strong>{formData.email}</strong>. Vui lòng kiểm tra hộp thư
                  và nhấp vào liên kết để kích hoạt tài khoản.
                </p>
              </div>

              <Button onClick={() => router.push("/signin")} className="w-full">
                Quay lại đăng nhập
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium text-primary">{isSignup ? vi.auth.signUp : vi.auth.signIn}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <Card className="w-full max-w-sm bg-card border-0 shadow-none">
          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm text-muted-foreground">
                      {vi.auth.firstName}
                    </Label>
                    <Input
                      id="firstName"
                      placeholder={vi.auth.placeholders.firstName}
                      value={formData.firstName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm text-muted-foreground">
                      {vi.auth.lastName}
                    </Label>
                    <Input
                      id="lastName"
                      placeholder={vi.auth.placeholders.lastName}
                      value={formData.lastName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="h-12"
                      required
                    />
                  </div>
                </div>
              )}

              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="getOtp" className="text-sm text-muted-foreground">
                      {vi.auth.getOtp}
                    </Label>
                    <Input id="getOtp" placeholder={vi.auth.placeholders.getOtp} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm text-muted-foreground">
                      {vi.auth.age}
                    </Label>
                    <Input
                      id="age"
                      placeholder={vi.auth.placeholders.age}
                      value={formData.age}
                      onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  {vi.auth.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={vi.auth.placeholders.email}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  {vi.auth.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={vi.auth.placeholders.password}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              {!isSignup && (
                <div className="text-right">
                  <Button variant="link" className="text-sm text-primary p-0 h-auto">
                    {vi.auth.forgotPassword}
                  </Button>
                </div>
              )}

              {/* Loading State to Button */}
              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading ? "Vui lòng đợi..." : "Tiếp tục"}
              </Button>
            </form>

            {/* Social Login */}
            <div className="space-y-3">
              <div className="text-center text-sm text-muted-foreground">{vi.auth.orContinueWith}</div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin("apple")}
                  className="w-12 h-12 p-0"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.87.78 0 2.26-1.07 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin("google")}
                  className="w-12 h-12 p-0"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin("facebook")}
                  className="w-12 h-12 p-0"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Terms and Toggle */}
            {isSignup && (
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {vi.auth.bySigningUp}{" "}
                <Button variant="link" className="text-xs text-primary p-0 h-auto underline">
                  {vi.auth.termsAndConditions}
                </Button>
              </p>
            )}

            {!isSignup && (
              <p className="text-sm text-center text-muted-foreground">
                {vi.auth.dontHaveAccount}{" "}
                <Button
                  variant="link"
                  onClick={handleToggleMode}
                  className="text-sm text-primary p-0 h-auto font-medium"
                >
                  {vi.auth.signUp}
                </Button>
              </p>
            )}

            {isSignup && (
              <p className="text-sm text-center text-muted-foreground">
                {vi.auth.alreadyHaveAccount}{" "}
                <Button
                  variant="link"
                  onClick={handleToggleMode}
                  className="text-sm text-primary p-0 h-auto font-medium"
                >
                  {vi.auth.signIn}
                </Button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
