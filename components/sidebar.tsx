"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  TrendingUp,
  Clock,
  ThumbsUp,
  Users,
  Search,
  Upload,
  Video,
  Settings,
  HelpCircle,
  User,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Trending",
    href: "/trending",
    icon: TrendingUp,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
  },
]

const libraryItems = [
  {
    title: "My Videos",
    href: "/my-videos",
    icon: Video,
  },
  {
    title: "Liked Videos",
    href: "/liked",
    icon: ThumbsUp,
  },
  {
    title: "Watch Later",
    href: "/watch-later",
    icon: Clock,
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: Users,
  },
]

const otherItems = [
  {
    title: "Upload",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Check session storage for current user
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = sessionStorage.getItem("videome_user")
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }

    checkUser()

    // Listen for storage changes
    const handleStorageChange = () => {
      checkUser()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Main Navigation */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                  pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Library Section - Only show if user is signed in */}
        {currentUser && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Library</h2>
            <div className="space-y-1">
              {libraryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                    pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Items */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">More</h2>
          <div className="space-y-1">
            {otherItems.map((item) => {
              // Only show upload and profile if user is signed in
              if ((item.href === "/upload" || item.href === "/profile") && !currentUser) {
                return null
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                    pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sign in prompt for non-authenticated users */}
        {!currentUser && (
          <div className="px-3 py-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">Sign in to access your library, upload videos, and more.</p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
