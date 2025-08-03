"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingVideoCard } from "@/components/trending-video-card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface TrendingVideo {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  user_id: string
  username: string
  avatar_url: string
  trending_score: number
  engagement_rate: number
}

export function TrendingContent() {
  const [videos, setVideos] = useState<TrendingVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [timePeriod, setTimePeriod] = useState("24h")
  const [sortBy, setSortBy] = useState("trending_score")
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const supabase = createClient()

  const fetchTrendingVideos = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setOffset(0)
      } else {
        setLoadingMore(true)
      }

      const currentOffset = reset ? 0 : offset

      const { data, error } = await supabase.rpc("get_trending_videos", {
        time_period: timePeriod,
        sort_by: sortBy,
        limit_count: limit,
        offset_count: currentOffset,
      })

      if (error) {
        console.error("Error fetching trending videos:", error)
        return
      }

      if (data) {
        if (reset) {
          setVideos(data)
        } else {
          setVideos((prev) => [...prev, ...data])
        }

        setHasMore(data.length === limit)
        setOffset(currentOffset + data.length)
      }
    } catch (error) {
      console.error("Error fetching trending videos:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchTrendingVideos(true)
  }, [timePeriod, sortBy])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchTrendingVideos(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Trending Videos</h2>
        <div className="flex gap-4">
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending_score">Trending Score</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
              <SelectItem value="likes">Most Likes</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video w-full bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trending videos found for this time period.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <TrendingVideoCard key={video.id} video={video} rank={index + 1} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-8">
              <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline" size="lg">
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Videos"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
