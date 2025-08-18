"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { TrendingUp, Eye, Heart, MessageCircle, Video } from "lucide-react"

interface TrendingStats {
  total_videos: number
  total_views: number
  total_likes: number
  total_comments: number
  avg_engagement_rate: number
}

interface TrendingStatsProps {
  timePeriod: string
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function TrendingStats({ timePeriod }: TrendingStatsProps) {
  const [stats, setStats] = useState<TrendingStats | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [timePeriod])

  const fetchStats = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.rpc("get_trending_stats", {
        time_period: timePeriod,
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      title: "Total Videos",
      value: formatNumber(stats.total_videos),
      icon: Video,
      color: "text-blue-600",
    },
    {
      title: "Total Views",
      value: formatNumber(stats.total_views),
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Total Likes",
      value: formatNumber(stats.total_likes),
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Total Comments",
      value: formatNumber(stats.total_comments),
      icon: MessageCircle,
      color: "text-purple-600",
    },
    {
      title: "Avg Engagement",
      value: `${stats.avg_engagement_rate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
