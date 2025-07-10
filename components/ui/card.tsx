import * as React from "react"
import { cn } from "@/lib/utils"

// 🌿 Card Container with stronger border, glow & transition
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border-2 border-green-400 bg-white text-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-emerald-300 hover:shadow-[0_4px_20px_rgba(34,197,94,0.3)] dark:bg-muted dark:text-muted-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// 🧩 Header section
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 px-6 pt-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// 🏷️ Bold Title
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight text-emerald-700",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ✏️ Softer description
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// 📦 Main content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-6 py-4 text-sm leading-relaxed", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

// 🧩 Footer with actions
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end gap-2 px-6 pb-6 pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// ✅ Exports
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
}
