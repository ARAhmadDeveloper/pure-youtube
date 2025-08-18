"use client"

import type React from "react"

import { Search, Upload, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarToggle } from "./sidebar-toggle"
import { useAuth } from "./auth-provider"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface HeaderProps {
  sidebarOpen?: boolean
  onSidebarToggle?: () => void
}

export function Header({ sidebarOpen = false, onSidebarToggle }: HeaderProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {onSidebarToggle && (
            <SidebarToggle isOpen={sidebarOpen} onToggle={onSidebarToggle} variant="hamburger" position="header" />
          )}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VM</span>
            </div>
            <span className="font-bold text-xl">VideoMe</span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Link href="/upload">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Upload className="h-5 w-5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5" />
          </Button>

          <Link href="/profile">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
