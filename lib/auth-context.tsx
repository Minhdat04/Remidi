"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  age?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    age?: string
  }) => Promise<void>
  logout: () => Promise<void>
  socialLogin: (provider: "google" | "facebook" | "apple") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - just set a user
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "mock-user-id",
        email,
        firstName: "Người dùng",
        lastName: "Demo",
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    age?: string
  }) => {
    setIsLoading(true)
    try {
      // Mock signup
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "mock-user-id",
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
      })
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading(true)
    try {
      // Mock social login
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "mock-user-id",
        email: `user@${provider}.com`,
        firstName: "Người dùng",
        lastName: provider.charAt(0).toUpperCase() + provider.slice(1),
      })
    } catch (error) {
      console.error("Social login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
