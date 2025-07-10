"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type AuthModalProps = {
  showAuthModal: boolean
  setShowAuthModal: (value: boolean) => void
  authMode: "login" | "signup"
  setAuthMode: (mode: "login" | "signup") => void
  authForm: { email: string; password: string; name: string }
  setAuthForm: React.Dispatch<React.SetStateAction<{ email: string; password: string; name: string }>>
  authError: string
  isLoading: boolean
  handleAuth: (e: React.FormEvent) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authError,
  isLoading,
  handleAuth,
  showPassword,
  setShowPassword,
}) => {
  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{authMode === "login" ? "Welcome Back" : "Join CarbonIQ"}</DialogTitle>
          <DialogDescription>
            {authMode === "login"
              ? "Continue your eco-friendly journey"
              : "Start making a positive impact today"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={cn(
                "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                authMode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={cn(
                "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                authMode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={authMode === "login" ? "Enter your password" : "Create a password"}
                  value={authForm.password}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="pr-10"
                  required
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {authError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {authError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? authMode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : authMode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
