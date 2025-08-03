"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { Home, TrendingUp, Clock, ThumbsUp, Video, Users, Settings, HelpCircle } from "lucide-react"

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
    title: "Watch Later",
    href: "/watch-later",
    icon: Clock,
  },
  {
    title: "Liked Videos",
    href: "/liked",
    icon: ThumbsUp,
  },
]

const libraryItems = [
  {
    title: "My Videos",
    href: "/my-videos",
    icon: Video,
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: Users,
  },
]

const settingsItems = [
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

export function AnimatedSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r z-50 transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-16",
          "md:relative md:top-0 md:h-full",
        )}
      >
        {/* Toggle Button */}
        <SidebarToggle isOpen={isOpen} onToggle={toggleSidebar} variant="chevron" position="sidebar" size="sm" />

        {/* Sidebar Content */}
        <div
          className={cn("h-full transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:opacity-100")}
        >
          <ScrollArea className={cn("h-full py-4 custom-scrollbar", isOpen ? "px-3" : "px-1")}>
            <nav className="space-y-6">
              {/* Main Navigation */}
              <div>
                <ul className="space-y-1">
                  {sidebarItems.map((item, index) => (
                    <li key={item.href}>
                      <Button
                        asChild
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start transition-all duration-200 group",
                          pathname === item.href && "bg-secondary shadow-sm",
                          !isOpen && "md:px-2",
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <Link href={item.href} className="flex items-center">
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-all duration-200",
                              isOpen ? "mr-3" : "md:mr-0",
                              pathname === item.href && "text-primary",
                            )}
                          />
                          <span
                            className={cn(
                              "transition-all duration-300 overflow-hidden",
                              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:hidden",
                            )}
                          >
                            {item.title}
                          </span>
                          {!isOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden md:block">
                              {item.title}
                            </div>
                          )}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Library Section */}
              <div>
                <h3
                  className={cn(
                    "mb-2 px-3 text-sm font-semibold text-muted-foreground transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 md:opacity-0",
                  )}
                >
                  Library
                </h3>
                <ul className="space-y-1">
                  {libraryItems.map((item, index) => (
                    <li key={item.href}>
                      <Button
                        asChild
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start transition-all duration-200 group",
                          pathname === item.href && "bg-secondary shadow-sm",
                          !isOpen && "md:px-2",
                        )}
                        style={{
                          animationDelay: `${(index + sidebarItems.length) * 50}ms`,
                        }}
                      >
                        <Link href={item.href} className="flex items-center">
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-all duration-200",
                              isOpen ? "mr-3" : "md:mr-0",
                              pathname === item.href && "text-primary",
                            )}
                          />
                          <span
                            className={cn(
                              "transition-all duration-300 overflow-hidden",
                              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:hidden",
                            )}
                          >
                            {item.title}
                          </span>
                          {!isOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden md:block">
                              {item.title}
                            </div>
                          )}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Settings Section */}
              <div>
                <h3
                  className={cn(
                    "mb-2 px-3 text-sm font-semibold text-muted-foreground transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 md:opacity-0",
                  )}
                >
                  More
                </h3>
                <ul className="space-y-1">
                  {settingsItems.map((item, index) => (
                    <li key={item.href}>
                      <Button
                        asChild
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start transition-all duration-200 group",
                          pathname === item.href && "bg-secondary shadow-sm",
                          !isOpen && "md:px-2",
                        )}
                        style={{
                          animationDelay: `${(index + sidebarItems.length + libraryItems.length) * 50}ms`,
                        }}
                      >
                        <Link href={item.href} className="flex items-center">
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-all duration-200",
                              isOpen ? "mr-3" : "md:mr-0",
                              pathname === item.href && "text-primary",
                            )}
                          />
                          <span
                            className={cn(
                              "transition-all duration-300 overflow-hidden",
                              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:hidden",
                            )}
                          >
                            {item.title}
                          </span>
                          {!isOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden md:block">
                              {item.title}
                            </div>
                          )}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
