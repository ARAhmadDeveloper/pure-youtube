"use client"

import { Home, TrendingUp, Heart, Clock, Users, Settings, HelpCircle, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarToggle } from "./sidebar-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: Heart, label: "Liked Videos", href: "/liked" },
  { icon: Clock, label: "Watch Later", href: "/watch-later" },
  { icon: Users, label: "Subscriptions", href: "/subscriptions" },
  { icon: History, label: "History", href: "/history" },
]

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      id="sidebar"
      className={cn(
        "relative w-64 h-full bg-white border-r border-gray-200 transition-all duration-300",
        "flex flex-col",
      )}
    >
      {/* Sidebar toggle button on the edge */}
      <SidebarToggle isOpen={isOpen} onToggle={onToggle} variant="chevron" position="sidebar" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive && "bg-red-50 text-red-600 hover:bg-red-100",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Bottom items */}
        <div className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive && "bg-red-50 text-red-600 hover:bg-red-100",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
