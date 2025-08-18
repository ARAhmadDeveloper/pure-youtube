"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { TrendingVideoCard } from "./trending-video-card"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface TrendingVideo {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  views_count: number
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  user_id: string
  username: string
  avatar_url: string
  trending_score: number
  engagement_rate: number
}

interface TrendingContentProps {
  timePeriod: string
  sortBy: string
}

export function TrendingContent({ timePeriod, sortBy }: TrendingContentProps) {
  const [videos, setVideos] = useState<TrendingVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchTrendingVideos()
  }, [timePeriod, sortBy])

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc("get_trending_videos", {
        limit_count: 20,
        offset_count: 0,
        sort_by: sortBy,
        time_period: timePeriod,
      })

      if (error) {
        console.error("Error fetching trending videos:", error)
        setError("Failed to load trending videos")
        return
      }

      setVideos(data || [])
    } catch (error) {
      console.error("Error fetching trending videos:", error)
      setError("Failed to load trending videos")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading trending videos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No trending videos found for this time period.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <TrendingVideoCard key={video.id} video={video} rank={index + 1} />
      ))}
    </div>
  )
}
