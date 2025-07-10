"use client"
import { motion } from "framer-motion"
import type React from "react"
import { useState, useEffect } from "react"
import {
  Leaf,
  User,
  LogIn,
  LogOut,
  Target,
  Award,
  Lightbulb,
  Info,
  Home,
  Check,
  Flame,
  Calendar,
  Recycle,
  Car,
  Star,
  Zap,
  Droplets,
  Mail,
  Eye,
  EyeOff,
  Plus,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { AuthModal } from "@/components/ui/AuthModel"
import { Sparkles, HeartHandshake } from "lucide-react"
import {
  PieChart,
  Pie,
  Area,
  AreaChart,
  Cell,
  BarChart, Bar, LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"
import { Tooltip } from "@/components/ui/tooltip"


type Difficulty = "Easy" | "Medium" | "Hard"

type Suggestion = {
  id: string
  title: string
  description: string
  impact: string
  iconName: string
  difficulty: Difficulty
}


type Section = "home" | "dashboard" | "tips" | "about" | "contact"

interface AppUser {
  id: string
  email: string
  name: string
  createdAt: string
}

interface UserData {
  ecoScore: number
  currentStreak: number
  checkIns: DailyCheckIn[]
  monthlyScores: MonthlyScore[]
  badges: BadgeData[]
  selectedSuggestions: string[]
}

interface BadgeData {
  id: string
  progress: number
  unlocked: boolean
}

interface DailyCheckIn {
  date: string
  transportation: string
  meatConsumption: boolean
  acUsage: boolean
  onlineOrdering: boolean
  plasticUsage: boolean
  completed: boolean
  ecoScore: number
}

interface MonthlyScore {
  date: string
  score: number
}

export default function EcoMeter() {
  const [currentSection, setCurrentSection] = useState<Section>("home")
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Daily check-in state
  const [dailyCheckInForm, setDailyCheckInForm] = useState({
    transportation: "",
    meatConsumption: false,
    acUsage: false,
    onlineOrdering: false,
    plasticUsage: false,
  })

  // Badge definitions
  const getBadgeDefinitions = () => [
    {
      id: "streak-7",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      iconName: "flame",
      condition: (userData: UserData) => userData.currentStreak >= 7,
      progressCalculator: (userData: UserData) => Math.min((userData.currentStreak / 7) * 100, 100),
    },
    {
      id: "streak-30",
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      iconName: "calendar",
      condition: (userData: UserData) => userData.currentStreak >= 30,
      progressCalculator: (userData: UserData) => Math.min((userData.currentStreak / 30) * 100, 100),
    },
    {
      id: "plastic-free",
      name: "Plastic Avoider",
      description: "Avoid plastic for 10 days",
      iconName: "recycle",
      condition: (userData: UserData) => {
        const recentCheckIns = userData.checkIns.slice(-10)
        return recentCheckIns.length >= 10 && recentCheckIns.every((checkIn) => !checkIn.plasticUsage)
      },
      progressCalculator: (userData: UserData) => {
        const recentCheckIns = userData.checkIns.slice(-10)
        const plasticFreeCount = recentCheckIns.filter((checkIn) => !checkIn.plasticUsage).length
        return Math.min((plasticFreeCount / 10) * 100, 100)
      },
    },
    {
      id: "transport-hero",
      name: "Transport Hero",
      description: "Use eco-friendly transport for 15 days",
      iconName: "car",
      condition: (userData: UserData) => {
        const ecoFriendlyTransport = userData.checkIns.filter(
          (checkIn) =>
            checkIn.transportation === "public" ||
            checkIn.transportation === "bike" ||
            checkIn.transportation === "walk",
        )
        return ecoFriendlyTransport.length >= 15
      },
      progressCalculator: (userData: UserData) => {
        const ecoFriendlyTransport = userData.checkIns.filter(
          (checkIn) =>
            checkIn.transportation === "public" ||
            checkIn.transportation === "bike" ||
            checkIn.transportation === "walk",
        )
        return Math.min((ecoFriendlyTransport.length / 15) * 100, 100)
      },
    },
    {
      id: "eco-champion",
      name: "Eco Champion",
      description: "Achieve an 8+ EcoScore",
      iconName: "star",
      condition: (userData: UserData) => userData.ecoScore >= 8,
      progressCalculator: (userData: UserData) => Math.min((userData.ecoScore / 8) * 100, 100),
    },
    {
      id: "green-starter",
      name: "Green Starter",
      description: "Complete your first week",
      iconName: "leaf",
      condition: (userData: UserData) => userData.checkIns.length >= 7,
      progressCalculator: (userData: UserData) => Math.min((userData.checkIns.length / 7) * 100, 100),
    },
  ]

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "flame":
        return <Flame className="h-6 w-6" />
      case "calendar":
        return <Calendar className="h-6 w-6" />
      case "recycle":
        return <Recycle className="h-6 w-6" />
      case "car":
        return <Car className="h-6 w-6" />
      case "star":
        return <Star className="h-6 w-6" />
      case "leaf":
        return <Leaf className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  // Sample personalized suggestions
  const personalizedSuggestions: Suggestion[] = [
    {
      id: "transport",
      title: "Try public transport twice a week",
      description: "Replace car trips with bus or train for your work commute",
      impact: "Reduce CO₂ by 2.6 tons/year",
      iconName: "car",
      difficulty: "Easy",
    },
    {
      id: "energy",
      title: "Reduce AC usage by one hour daily",
      description: "Set your thermostat 2°F higher during peak hours",
      impact: "Save 10-15% on electricity",
      iconName: "zap",
      difficulty: "Easy",
    },
    {
      id: "water",
      title: "Take 5-minute showers",
      description: "Use a timer to keep track of your shower time",
      impact: "Save 12.5 gallons per shower",
      iconName: "droplets",
      difficulty: "Medium",
    },
    {
      id: "waste",
      title: "Use reusable bags for shopping",
      description: "Keep reusable bags in your car or by your front door",
      impact: "Avoid 100+ plastic bags per year",
      iconName: "recycle",
      difficulty: "Easy",
    },
  ]


  const getSuggestionIcon = (iconName: string) => {
    switch (iconName) {
      case "car":
        return <Car className="h-5 w-5" />
      case "zap":
        return <Zap className="h-5 w-5" />
      case "droplets":
        return <Droplets className="h-5 w-5" />
      case "recycle":
        return <Recycle className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  // Load user data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ecometer_user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        loadUserData(user.id)
        setCurrentSection("dashboard")
      } catch (error) {
        console.error("Error loading user data:", error)
        localStorage.removeItem("ecometer_user")
      }
    }
  }, [])

  // Save user data whenever it changes
  useEffect(() => {
    if (currentUser && userData) {
      try {
        const cleanUserData = {
          ecoScore: userData.ecoScore,
          currentStreak: userData.currentStreak,
          checkIns: userData.checkIns,
          monthlyScores: userData.monthlyScores,
          badges: userData.badges,
          selectedSuggestions: userData.selectedSuggestions,
        }
        localStorage.setItem(`ecometer_data_${currentUser.id}`, JSON.stringify(cleanUserData))
      } catch (error) {
        console.error("Error saving user data:", error)
      }
    }
  }, [currentUser, userData])

  const loadUserData = (userId: string) => {
    try {
      const savedData = localStorage.getItem(`ecometer_data_${userId}`)
      if (savedData) {
        const data = JSON.parse(savedData)
        const badgeDefinitions = getBadgeDefinitions()
        const updatedBadges = badgeDefinitions.map((badgeDef) => ({
          id: badgeDef.id,
          progress: badgeDef.progressCalculator(data),
          unlocked: badgeDef.condition(data),
        }))
        setUserData({
          ...data,
          badges: updatedBadges,
        })
      } else {
        const badgeDefinitions = getBadgeDefinitions()
        const initialBadges = badgeDefinitions.map((badgeDef) => ({
          id: badgeDef.id,
          progress: 0,
          unlocked: false,
        }))

        const initialData: UserData = {
          ecoScore: 5.0,
          currentStreak: 0,
          checkIns: [],
          monthlyScores: [],
          badges: initialBadges,
          selectedSuggestions: [],
        }
        setUserData(initialData)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (authMode === "signup") {
        const existingUsers = JSON.parse(localStorage.getItem("ecometer_users") || "[]")
        if (existingUsers.find((u: AppUser) => u.email === authForm.email)) {
          throw new Error("An account with this email already exists!")
        }

        const newUser: AppUser = {
          id: Date.now().toString(),
          email: authForm.email,
          name: authForm.name,
          createdAt: new Date().toISOString(),
        }

        existingUsers.push(newUser)
        localStorage.setItem("ecometer_users", JSON.stringify(existingUsers))
        localStorage.setItem("ecometer_user", JSON.stringify(newUser))

        setCurrentUser(newUser)
        loadUserData(newUser.id)
        setCurrentSection("home") // ✅ Redirect to home instead of dashboard
      } else {
        const existingUsers = JSON.parse(localStorage.getItem("ecometer_users") || "[]")
        const user = existingUsers.find((u: AppUser) => u.email === authForm.email)

        if (!user) {
          throw new Error("No account found with that email!")
        }

        localStorage.setItem("ecometer_user", JSON.stringify(user))
        setCurrentUser(user)
        loadUserData(user.id)
        setCurrentSection("home") // ✅ Redirect to home instead of dashboard
      }

      setShowAuthModal(false)
      setAuthForm({ email: "", password: "", name: "" })
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }


  const handleLogout = () => {
    localStorage.removeItem("ecometer_user")
    setCurrentUser(null)
    setUserData(null)
    setCurrentSection("home")
  }

  const handleNavigation = (section: Section) => {
    if (!currentUser && section !== "home" && section !== "about" && section !== "contact") {
      setShowAuthModal(true)
      return
    }

    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    setCurrentSection(section)
  }


  const getTodaysCheckIn = () => {
    if (!userData) return null
    const today = new Date().toISOString().split("T")[0]
    return userData.checkIns.find((checkIn) => checkIn.date === today) || null
  }

  const submitDailyCheckIn = () => {
    if (!currentUser || !userData) return

    const today = new Date().toISOString().split("T")[0]
    const existingCheckIn = userData.checkIns.find((checkIn) => checkIn.date === today)
    if (existingCheckIn) return

    const newCheckIn = {
      date: today,
      ...dailyCheckInForm,
      completed: true,
      ecoScore: calculateDailyScore(dailyCheckInForm),
    }

    const newStreak = updateStreak(newCheckIn)
    const newMonthlyScores = [...userData.monthlyScores, { date: today, score: newCheckIn.ecoScore }]
    const recentScores = newMonthlyScores.slice(-30)
    const newEcoScore = recentScores.reduce((sum, score) => sum + score.score, 0) / recentScores.length

    const updatedUserData = {
      ...userData,
      ecoScore: Math.round(newEcoScore * 10) / 10,
      currentStreak: newStreak,
      checkIns: [...userData.checkIns, newCheckIn],
      monthlyScores: newMonthlyScores,
    }

    const badgeDefinitions = getBadgeDefinitions()
    const updatedBadges = badgeDefinitions.map((badgeDef) => ({
      id: badgeDef.id,
      progress: badgeDef.progressCalculator(updatedUserData),
      unlocked: badgeDef.condition(updatedUserData),
    }))

    setUserData({ ...updatedUserData, badges: updatedBadges })

    setDailyCheckInForm({
      transportation: "",
      meatConsumption: false,
      acUsage: false,
      onlineOrdering: false,
      plasticUsage: false,
    })
  }

  const calculateDailyScore = (checkIn: any) => {
    let score = 5.0

    switch (checkIn.transportation) {
      case "walk":
        score += 2.0
        break
      case "public":
        score += 1.0
        break
      case "car":
        score -= 1.0
        break
    }

    if (!checkIn.meatConsumption) score += 0.5
    if (!checkIn.acUsage) score += 0.5
    if (!checkIn.onlineOrdering) score += 0.3
    if (!checkIn.plasticUsage) score += 0.7

    return Math.min(Math.max(score, 0), 10)
  }

  const updateStreak = (newCheckIn: any) => {
    if (!userData) return 0

    const today = new Date(newCheckIn.date)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayStr = yesterday.toISOString().split("T")[0]
    const hasYesterdayCheckIn = userData.checkIns.some((checkIn) => checkIn.date === yesterdayStr)

    if (userData.checkIns.length === 0 || hasYesterdayCheckIn) {
      return userData.currentStreak + 1
    } else {
      return 1
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600"
    if (score >= 6) return "text-amber-600"
    return "text-orange-600"
  }

  const getScoreRingColor = (score: number) => {
    if (score >= 8) return "stroke-emerald-500"
    if (score >= 6) return "stroke-amber-500"
    return "stroke-orange-500"
  }

  // Score Ring Component
  const ScoreRing = ({ score, size = 120 }: { score: number; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (score / 10) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={getScoreRingColor(score)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</div>
            <div className="text-xs text-gray-500">EcoScore</div>
          </div>
        </div>
      </div>
    )
  }

  // Navigation Bar Component
  const NavigationBar = () => {
    const navigationItems = [
      { id: "home", label: "Home", icon: Home },
      { id: "dashboard", label: "Dashboard", icon: BarChart3 },
      { id: "tips", label: "Tips", icon: Lightbulb },
      { id: "about", label: "About Us", icon: Info },
      { id: "contact", label: "Contact Us", icon: Mail },
    ]

    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">CarbonIQ</span>
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id as Section)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    currentSection === item.id
                      ? "bg-emerald-100 text-emerald-700 shadow-inner"
                      : "text-gray-600 hover:text-emerald-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id as Section)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    currentSection === item.id
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-gray-500 hover:text-emerald-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </button>
              ))}
            </div>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-lg">
                {currentUser ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-gray-800 border-b border-gray-100">
                      {currentUser.name}
                    </div>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setShowAuthModal(true)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    )
  }


  // Fixed Auth Modal - no more flipping
  const AuthModal = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false) // ⬅️ make sure this is defined or lifted up

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError("")

    try {
      if (!authForm.email || !authForm.password || (authMode === "signup" && !authForm.name)) {
        throw new Error("Please fill in all required fields")
      }

      // Simulate auth call (you can connect your backend/API here)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // On success
      setShowAuthModal(false)
      setAuthForm({ name: "", email: "", password: "" })
    } catch (error: any) {
      setAuthError(error.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

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
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            {["login", "signup"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode as "login" | "signup")}
                className={cn(
                  "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                  authMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                {mode === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Akriti Shakya"
                  value={authForm.name}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={authMode === "login" ? "Enter your password" : "Create a password"}
                  className="pr-10"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {authError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{authError}</div>
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


  // Home Page
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-green-50">
      {/* Hero Section */}
      <section className="py-28 px-4 sm:px-6 bg-green-100 rounded-b-3xl shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6"
          >
            <Leaf className="h-12 w-12 text-emerald-600" />
          </motion.div>
          <h1 className="text-5xl font-bold text-emerald-800 mb-4 leading-tight">
            Start Your Sustainable Journey with CarbonIQ
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Track eco-friendly habits, reduce your carbon footprint, and build a lifestyle that loves the planet 🌍
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowAuthModal(true)}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentSection("about")}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-2">How It Works</h2>
            <p className="text-gray-600">Start small. Build habits. Watch your impact grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8 text-emerald-700" />,
                title: "Check Your Habits",
                desc: "Log your everyday choices like commuting, electricity usage, and waste habits.",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-emerald-700" />,
                title: "Track Your EcoScore",
                desc: "Get instant feedback on how eco-friendly your lifestyle really is.",
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-emerald-700" />,
                title: "Grow with Smart Tips",
                desc: "Receive actionable tips and challenges to keep improving sustainably.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl text-center shadow hover:shadow-md transition"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Features That Empower You</h2>
            <p className="text-gray-600 text-lg">Tools designed to help you build climate-positive routines</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: "1-Min Check-ins", desc: "Track your habits daily with just a few taps." },
              { icon: Award, title: "Achievement Badges", desc: "Get rewarded as you build climate-conscious habits." },
              { icon: Lightbulb, title: "Smart Tips", desc: "Personalized advice to level up your green lifestyle." },
              { icon: Globe, title: "Eco Insights", desc: "Visualize your CO₂ & water savings in real-time." },
            ].map((feat, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feat.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-600">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Measured Change. Real Results.</h2>
          <p className="text-lg text-gray-600 mb-12">Every action you take leads to measurable environmental wins 🌎</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ["250+ kg", "CO₂ saved by reducing AC use 1hr/day"],
              ["2.6 tons", "Carbon reduction by using public transport 2x/week"],
              ["4,500 gal", "Water saved annually by 5-minute showers"],
            ].map(([value, desc], idx) => (
              <div key={idx}>
                <div className="text-4xl font-extrabold text-emerald-600 mb-2">{value}</div>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center bg-white shadow-md rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Ready to Join the Eco Movement?</h2>
          <p className="text-gray-700 text-lg mb-6">
            Thousands are already creating change with CarbonIQ. Will you be next?
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setShowAuthModal(true)}
          >
            Start My Journey
          </Button>
        </div>
      </section>
    </div>
  )




  // Dashboard Page with integrated badges
  const DashboardPage = () => {
    const todaysCheckIn = getTodaysCheckIn()

    return (
      <div className="min-h-screen bg-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Track your daily eco-friendly habits and progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">EcoScore</p>
                    <p className={`text-3xl font-bold ${getScoreColor(userData?.ecoScore || 5)}`}>
                      {userData?.ecoScore ? userData.ecoScore.toFixed(1) : "5.0"}
                    </p>
                    <p className="text-sm text-gray-500">out of 10</p>
                  </div>
                  <ScoreRing score={userData?.ecoScore || 5} size={80} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
                    <p className="text-3xl font-bold text-amber-600">{userData?.currentStreak || 0}</p>
                    <p className="text-sm text-gray-500">days</p>
                  </div>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <Flame className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Check-ins</p>
                    <p className="text-3xl font-bold text-emerald-600">{userData?.checkIns.length || 0}</p>
                    <p className="text-sm text-gray-500">completed</p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Check-in */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Daily Check-in</CardTitle>
              <CardDescription>Track your habits for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysCheckIn ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Check-in Complete</h3>
                  <p className="text-gray-600">Today's EcoScore: {todaysCheckIn.ecoScore.toFixed(1)}/10</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-3 block">How did you get around today?</Label>
                      <RadioGroup
                        value={dailyCheckInForm.transportation}
                        onValueChange={(value) =>
                          setDailyCheckInForm((prev) => ({ ...prev, transportation: value }))
                        }
                        className="space-y-3"
                      >
                        {[
                          { id: "walk", label: "Walking/Cycling" },
                          { id: "public", label: "Public Transport" },
                          { id: "car", label: "Personal Car" },
                        ].map(({ id, label }) => (
                          <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value={id} id={id} />
                            <Label htmlFor={id} className="cursor-pointer flex-1">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "meat", label: "Ate meat today", checked: dailyCheckInForm.meatConsumption },
                        { id: "ac", label: "Used AC/heating", checked: dailyCheckInForm.acUsage },
                        { id: "ordering", label: "Online ordering", checked: dailyCheckInForm.onlineOrdering },
                        { id: "plastic", label: "Used single-use plastic", checked: dailyCheckInForm.plasticUsage },
                      ].map(({ id, label, checked }) => (
                        <div
                          key={id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <Label htmlFor={id} className="font-medium">
                            {label}
                          </Label>
                          <Switch
                            id={id}
                            checked={checked}
                            onCheckedChange={(value) =>
                              setDailyCheckInForm((prev) => ({ ...prev, [id]: value }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={submitDailyCheckIn}
                    className="w-full"
                    size="lg"
                    disabled={!dailyCheckInForm.transportation}
                  >
                    Submit Check-in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Your Achievements</span>
              </CardTitle>
              <CardDescription>Track your progress and unlock new milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData?.badges.map((badge) => {
                  const badgeDefinition = getBadgeDefinitions().find((def) => def.id === badge.id)
                  if (!badgeDefinition) return null

                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        "p-4 border rounded-lg transition-all duration-200",
                        badge.unlocked
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-gray-200",
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
                            badge.unlocked
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          {getIconComponent(badgeDefinition.iconName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">{badgeDefinition.name}</h3>
                          <p className="text-xs text-gray-600 mb-3">{badgeDefinition.description}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{badge.progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={badge.progress} className="h-1.5" />
                          </div>
                          {badge.unlocked && (
                            <UIBadge className="mt-2 bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                              Unlocked
                            </UIBadge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }


  //Contact Us Page 
  const ContactUsPage = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.name || !formData.email || !formData.message) {
        toast.error("Please fill in all fields")
        return
      }

      toast.success("Message sent successfully!")
      setFormData({ name: "", email: "", message: "" })
    }

    return (
      <section id="contact" className="min-h-screen bg-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-emerald-700 mb-2">Let’s Connect</h1>
            <p className="text-gray-600 text-sm">
              Have questions, suggestions, or feedback? We’d love to hear from you.
            </p>
          </div>

          {/* 🌿 Contact Form Card (unchanged) */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Fill out this form and we’ll respond shortly</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Let us know how we can help..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ✨ Additional Message Section */}
          <div className="mt-12 bg-white border border-green-100 shadow-sm rounded-xl p-6 text-center">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-2">
              Thank you for caring about the planet 🌍
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto">
              Every message you send helps us create a better, greener world. We’re committed to listening to your ideas
              and working together toward a sustainable future.
            </p>
          </div>
        </motion.div>
      </section>
    )
  }



  // Tips Page
  const TipsPage = () => {
    const categoryData = [
      {
        name: "🌍 Transportation",
        value: personalizedSuggestions.filter((t) => t.id === "transport").length,
      },
      {
        name: "🔌 Energy Usage",
        value: personalizedSuggestions.filter((t) => t.id === "energy").length,
      },
      {
        name: "💧 Water Conservation",
        value: personalizedSuggestions.filter((t) => t.id === "water").length,
      },
      {
        name: "♻️ Waste Management",
        value: personalizedSuggestions.filter((t) => t.id === "waste").length,
      },
    ]

    const CATEGORY_COLORS = {
      "🌍 Transportation": "#16a34a",   // green
      "🔌 Energy Usage": "#facc15",     // amber
      "💧 Water Conservation": "#38bdf8", // sky blue
      "♻️ Waste Management": "#a78bfa", // purple
    }


    const totalSuggestions = personalizedSuggestions.length
    const selected = userData?.selectedSuggestions.length || 0

    return (
      <div className="min-h-screen bg-green-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-emerald-700 mb-2">Smart Suggestions for a Greener You 🌱</h1>
            <p className="text-gray-700 text-sm">
              Practical ways to reduce your carbon footprint and boost your EcoScore
            </p>
          </div>

          {/* Visual Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Tip Category Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name }) => name}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]}
                        />
                      ))}
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>


            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Engagement</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[{ name: "Suggestions", Selected: selected, Total: totalSuggestions }]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="Selected" fill="#10b981" />
                    <Bar dataKey="Total" fill="#d1fae5" />
                    <RechartTooltip />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalizedSuggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-white border border-emerald-100"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getSuggestionIcon(suggestion.iconName)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{suggestion.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-600 mb-1">{suggestion.impact}</p>
                          <UIBadge variant="secondary" className="text-xs capitalize">
                            {suggestion.difficulty}
                          </UIBadge>
                        </div>
                        <Button
                          variant={
                            userData?.selectedSuggestions.includes(suggestion.id) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            if (!userData) return
                            const isSelected = userData.selectedSuggestions.includes(suggestion.id)
                            const updatedSuggestions = isSelected
                              ? userData.selectedSuggestions.filter((id) => id !== suggestion.id)
                              : [...userData.selectedSuggestions, suggestion.id]

                            setUserData((prev) =>
                              prev ? { ...prev, selectedSuggestions: updatedSuggestions } : null
                            )
                          }}
                        >
                          {userData?.selectedSuggestions.includes(suggestion.id) ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Goals
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }


  // About Page
  const AboutPage = () => {
    const ecoImpactTrend = [
      { month: "Jan", CO2: 2.1, Water: 300 },
      { month: "Feb", CO2: 2.6, Water: 450 },
      { month: "Mar", CO2: 3.0, Water: 700 },
      { month: "Apr", CO2: 4.2, Water: 1200 },
      { month: "May", CO2: 5.1, Water: 1600 },
    ]

    const userBehaviorStats = [
      { category: "Transport", score: 90 },
      { category: "Energy", score: 70 },
      { category: "Waste", score: 80 },
      { category: "Water", score: 65 },
      { category: "Plastic", score: 75 },
    ]

    return (
      <div className="min-h-screen bg-green-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-emerald-700 mb-2">About CarbonIQ</h1>
            <p className="text-gray-700 text-sm">
              Empowering individuals to transform everyday habits into measurable environmental progress 🌱
            </p>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Line Chart */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Eco Impact</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={ecoImpactTrend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line type="monotone" dataKey="CO2" stroke="#10b981" name="CO₂ Saved (kg)" />
                    <Line type="monotone" dataKey="Water" stroke="#0ea5e9" name="Water Saved (liters)" />
                    <RechartTooltip />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">User Behavior Score</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={userBehaviorStats}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.5}
                    />
                    <RechartTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Explanation Section */}
          <div className="bg-white p-8 rounded-lg shadow mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why CarbonIQ?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-sm">
              Climate change is a global issue—but action starts at the individual level. CarbonIQ was created to
              help everyday people understand, track, and improve their environmental habits with ease and confidence.
              We believe in the power of data-driven awareness and micro-decisions that ripple into macro impact.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed text-sm">
              The <span className="font-medium text-emerald-700">Monthly Eco Impact</span> chart above shows how user
              actions contribute to CO₂ reduction and water savings. Meanwhile, the <span className="font-medium text-teal-700">
                User Behavior Score</span> radar chart breaks down performance across key categories like waste, transport,
              and water use—helping users identify strengths and areas for improvement.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm">
              With <span className="font-semibold text-emerald-700">CarbonIQ</span>, sustainability isn’t just a buzzword—it’s a lifestyle
              made actionable, trackable, and empowering for everyone.
            </p>
          </div>

          {/* Call-to-Action */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-emerald-700 mb-3">Your Green Journey Starts Here</h3>
            <p className="text-gray-600 text-sm max-w-xl mx-auto mb-6">
              Join thousands who are already taking small but meaningful steps with CarbonIQ. Let’s reduce carbon footprints,
              conserve resources, and build a better planet—together. 💚
            </p>
          </div>
        </div>
      </div>
    )
  }





  // Main App Component
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main className="transition-all duration-300 ease-in-out">
        {currentSection === "home" && <HomePage />}
        {currentSection === "dashboard" && <DashboardPage />}
        {currentSection === "tips" && <TipsPage />}
        {currentSection === "about" && <AboutPage />}
        {currentSection === "contact" && <ContactUsPage />}
      </main>
      <AuthModal />
    </div>
  )
}
