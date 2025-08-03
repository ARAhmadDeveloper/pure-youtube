"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Eye, Heart, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TrendingStatsData {
  total_videos: number
  total_views: number
  total_likes: number
  total_comments: number
  avg_engagement_rate: number
}

export function TrendingStats() {
  const [stats, setStats] = useState<TrendingStatsData | null>(null)
  const [timePeriod, setTimePeriod] = useState("24h")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTrendingStats = async (period: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc("get_trending_stats", {
        time_period: period,
      })

      if (error) {
        console.error("Error fetching trending stats:", error)
        return
      }

      if (data && data.length > 0) {
        setStats(data[0])
      }
    } catch (error) {
      console.error("Error fetching trending stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingStats(timePeriod)
  }, [timePeriod])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const statsCards = [
    {
      title: "Total Videos",
      value: stats?.total_videos || 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: stats?.total_views || 0,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Likes",
      value: stats?.total_likes || 0,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Avg Engagement",
      value: `${stats?.avg_engagement_rate || 0}%`,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Trending Statistics</h2>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  ) : typeof stat.value === "string" ? (
                    stat.value
                  ) : (
                    formatNumber(stat.value)
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {timePeriod === "1h" && "in the last hour"}
                  {timePeriod === "24h" && "in the last 24 hours"}
                  {timePeriod === "7d" && "in the last 7 days"}
                  {timePeriod === "30d" && "in the last 30 days"}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
