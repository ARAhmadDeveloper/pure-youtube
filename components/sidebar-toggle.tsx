"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
  variant?: "menu" | "chevron" | "hamburger"
  size?: "sm" | "md" | "lg"
  position?: "header" | "sidebar" | "floating"
  sidebarId?: string
}

export function SidebarToggle({
  isOpen,
  onToggle,
  variant = "hamburger",
  size = "md",
  position = "header",
  sidebarId = "sidebar",
}: SidebarToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    onToggle()
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const positionClasses = {
    header: "relative",
    sidebar: "absolute -right-3 top-4 z-50 bg-background border shadow-md",
    floating: "fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border shadow-lg",
  }

  if (variant === "hamburger") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          sizeClasses[size],
          positionClasses[position],
          "group relative overflow-hidden transition-all duration-300 hover:bg-accent",
          isAnimating && "scale-95",
        )}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        aria-controls={sidebarId}
      >
        <div className="relative">
          {/* Hamburger Menu Animation */}
          <div className={cn("flex flex-col justify-center items-center", iconSizes[size])}>
            <span
              className={cn(
                "block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out",
                isOpen ? "rotate-45 translate-y-1" : "-translate-y-1",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out my-1",
                isOpen ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out",
                isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1",
              )}
            />
          </div>

          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
        </div>
      </Button>
    )
  }

  if (variant === "chevron") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          sizeClasses[size],
          positionClasses[position],
          "group relative overflow-hidden transition-all duration-300 hover:bg-accent rounded-full",
          isAnimating && "scale-95",
        )}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <div className="relative">
          {/* Chevron Animation */}
          <div className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}>
            {isOpen ? (
              <ChevronLeft className={cn(iconSizes[size], "transition-all duration-300")} />
            ) : (
              <ChevronRight className={cn(iconSizes[size], "transition-all duration-300")} />
            )}
          </div>

          {/* Background Pulse */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 scale-0 group-hover:scale-100 transition-transform duration-500" />
        </div>
      </Button>
    )
  }

  // Menu variant (default)
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        sizeClasses[size],
        positionClasses[position],
        "group relative overflow-hidden transition-all duration-300 hover:bg-accent",
        isAnimating && "scale-95",
      )}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <div className="relative">
        {/* Icon Transition */}
        <div className="relative">
          <Menu
            className={cn(
              iconSizes[size],
              "absolute transition-all duration-300 ease-in-out",
              isOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100",
            )}
          />
          <X
            className={cn(
              iconSizes[size],
              "absolute transition-all duration-300 ease-in-out",
              isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75",
            )}
          />
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 scale-0 group-hover:scale-100 transition-transform duration-400" />
      </div>
    </Button>
  )
}
