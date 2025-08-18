"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
  variant?: "hamburger" | "chevron" | "menu"
  position?: "header" | "sidebar" | "floating"
  className?: string
}

export function SidebarToggle({
  isOpen,
  onToggle,
  variant = "hamburger",
  position = "header",
  className,
}: SidebarToggleProps) {
  const handleToggle = () => {
    onToggle()
  }

  const getIcon = () => {
    switch (variant) {
      case "hamburger":
        return isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />
      case "chevron":
        return isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
      case "menu":
        return <Menu className="h-4 w-4" />
      default:
        return <Menu className="h-4 w-4" />
    }
  }

  const getPositionStyles = () => {
    switch (position) {
      case "header":
        return "relative"
      case "sidebar":
        return "absolute -right-3 top-4 bg-white shadow-lg border border-gray-200 hover:shadow-xl"
      case "floating":
        return "fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:shadow-xl"
      default:
        return "relative"
    }
  }

  if (variant === "hamburger") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn("transition-all duration-200", getPositionStyles(), isOpen && "bg-gray-100", className)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {getIcon()}
      </Button>
    )
  }

  if (variant === "chevron") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn("transition-all duration-200 rounded-full", getPositionStyles(), className)}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {getIcon()}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn("transition-all duration-200", getPositionStyles(), className)}
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
      aria-controls="sidebar"
    >
      {getIcon()}
    </Button>
  )
}
