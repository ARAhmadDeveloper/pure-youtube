"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TrendingStats } from "@/components/trending-stats"
import { TrendingContent } from "@/components/trending-content"
import { TrendingFilters } from "@/components/trending-filters"

export default function TrendingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState("week")
  const [sortBy, setSortBy] = useState("trending_score")

  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        redirect("/auth/signin")
        return
      }

      setUser(user)
    } catch (error) {
      console.error("Error checking auth:", error)
      redirect("/auth/signin")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trending Videos</h1>
        <p className="text-muted-foreground">Discover the most popular videos based on views, likes, and engagement</p>
      </div>

      <TrendingFilters
        timePeriod={timePeriod}
        sortBy={sortBy}
        onTimePeriodChange={setTimePeriod}
        onSortByChange={setSortBy}
      />

      <TrendingStats timePeriod={timePeriod} />

      <TrendingContent timePeriod={timePeriod} sortBy={sortBy} />
    </div>
  )
}
