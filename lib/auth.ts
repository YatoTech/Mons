"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("mons_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("mons_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo users for testing
    const demoUsers = [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "admin" as const,
        created_at: new Date().toISOString(),
        avatar_url: null,
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        role: "member" as const,
        created_at: new Date().toISOString(),
        avatar_url: null,
      },
    ]

    const foundUser = demoUsers.find((u) => u.email === email)

    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("mons_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: "Invalid email or password" }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if email already exists (demo)
    if (email === "alice@example.com" || email === "bob@example.com") {
      setIsLoading(false)
      return { success: false, error: "Email already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      role: "member",
      created_at: new Date().toISOString(),
      avatar_url: null,
    }

    setUser(newUser)
    localStorage.setItem("mons_user", JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)

    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo Google user
    const googleUser: User = {
      id: Date.now(),
      name: "Google User",
      email: "user@gmail.com",
      role: "member",
      created_at: new Date().toISOString(),
      avatar_url: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    }

    setUser(googleUser)
    localStorage.setItem("mons_user", JSON.stringify(googleUser))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mons_user")
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
