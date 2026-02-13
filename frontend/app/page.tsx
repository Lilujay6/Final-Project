/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!password.trim()) {
      errors.password = "Password is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    try {
      setLoading(true)

      const res = await api.post("/login", { email, password })

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token)
        router.push("/dashboard")
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.")
      } else if (err.response?.status === 403) {
        setError(
          "Students cannot access the admin panel. Please contact administrator."
        )
      } else {
        setError("Unable to login. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Library Access</h1>
              <p className="text-sm opacity-70">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2.5 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (validationErrors.email) {
                      setValidationErrors({
                        ...validationErrors,
                        email: "",
                      })
                    }
                  }}
                  className="text-base"
                />
                {validationErrors.email && (
                  <p className="text-xs text-destructive mt-1.5">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2.5 block">
                  Password
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (validationErrors.password) {
                        setValidationErrors({
                          ...validationErrors,
                          password: "",
                        })
                      }
                    }}
                    className="text-base pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {validationErrors.password && (
                  <p className="text-xs text-destructive mt-1.5">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-lg border bg-destructive/10 text-destructive text-sm">
                  <p className="font-medium">Login Error</p>
                  <p className="mt-1">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-xs opacity-50">
              © 2026 Library Access System
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
