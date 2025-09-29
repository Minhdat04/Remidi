"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

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
  logout: () => void
  socialLogin: (provider: "google" | "facebook" | "apple") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("remidi_user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
      }

      setUser(mockUser)
      localStorage.setItem("remidi_user", JSON.stringify(mockUser))
      console.log("[v0] User logged in:", mockUser)
    } catch (error) {
      console.error("[v0] Login error:", error)
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
      }

      setUser(newUser)
      localStorage.setItem("remidi_user", JSON.stringify(newUser))
      console.log("[v0] User signed up:", newUser)
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (provider: "google" | "facebook" | "apple") => {
    setIsLoading(true)
    try {
      // Simulate social login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Date.now().toString(),
        email: `user@${provider}.com`,
        firstName: "Social",
        lastName: "User",
      }

      setUser(mockUser)
      localStorage.setItem("remidi_user", JSON.stringify(mockUser))
      console.log("[v0] Social login successful:", provider, mockUser)
    } catch (error) {
      console.error("[v0] Social login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("remidi_user")
    console.log("[v0] User logged out")
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
