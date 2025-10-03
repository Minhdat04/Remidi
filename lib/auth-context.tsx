"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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
  supabaseUser: SupabaseUser | null
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
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          setSupabaseUser(authUser)

          // Fetch profile data
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

          if (profile) {
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              firstName: profile.full_name?.split(" ")[0] || "",
              lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
              avatar: profile.avatar_url || undefined,
            })
          }
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event)

      if (session?.user) {
        setSupabaseUser(session.user)

        // Fetch profile data
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            firstName: profile.full_name?.split(" ")[0] || "",
            lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
            avatar: profile.avatar_url || undefined,
          })
        }
      } else {
        setUser(null)
        setSupabaseUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log("[v0] User logged in:", data.user)
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
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
            age: userData.age,
          },
        },
      })

      if (error) throw error

      console.log("[v0] User signed up:", data.user)
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === "apple" ? "apple" : provider,
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      console.log("[v0] Social login initiated:", provider)
    } catch (error) {
      console.error("[v0] Social login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
    console.log("[v0] User logged out")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
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
