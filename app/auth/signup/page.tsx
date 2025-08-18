"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, username)
      if (error) {
        setError(error.message)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="floating-particle absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full blur-sm"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="floating-particle absolute top-40 right-32 w-6 h-6 bg-blue-400/30 rounded-full blur-sm"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="floating-particle absolute bottom-32 left-40 w-3 h-3 bg-purple-400/40 rounded-full blur-sm"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="floating-particle absolute bottom-20 right-20 w-5 h-5 bg-pink-400/30 rounded-full blur-sm"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="floating-particle absolute top-60 left-1/2 w-4 h-4 bg-cyan-400/30 rounded-full blur-sm"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl floating-particle">
            <span className="text-white font-bold text-xl">VM</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join VideoMe</h1>
          <p className="text-white/80">Create your account and start sharing</p>
        </div>

        {/* Sign Up Form */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-100 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center text-white/90 text-sm font-medium">
                <User className="w-4 h-4 mr-2" />
                Username
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-input text-white placeholder-white/50 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 h-12 rounded-xl"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-white/90 text-sm font-medium">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input text-white placeholder-white/50 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 h-12 rounded-xl"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-white/90 text-sm font-medium">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input text-white placeholder-white/50 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 h-12 rounded-xl pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-white/90 text-sm font-medium">
                <Lock className="w-4 h-4 mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-input text-white placeholder-white/50 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 h-12 rounded-xl pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={loading}
              className="glass-button shimmer-effect w-full h-12 rounded-xl text-white font-semibold text-base hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-white/80">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-300 hover:text-blue-200 font-semibold transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
