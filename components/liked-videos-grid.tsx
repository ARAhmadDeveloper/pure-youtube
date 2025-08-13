"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { LikedVideoCard } from "./liked-video-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  views: number
  created_at: string
  user_id: string
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
}

interface LikedVideo {
  id: string
  video_id: string
  user_id: string
  created_at: string
  videos: Video
}

interface LikedVideosGridProps {
  userId: string
}

export function LikedVideosGrid({ userId }: LikedVideosGridProps) {
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchLikedVideos()
  }, [userId])

  const fetchLikedVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      // First, get the liked video IDs
      const { data: likedData, error: likedError } = await supabase
        .from("video_likes")
        .select("video_id, created_at")
        .eq("user_id", userId)
        .eq("is_like", true)
        .order("created_at", { ascending: false })

      if (likedError) {
        console.error("Error fetching liked videos:", likedError)
        setError("Failed to fetch liked videos")
        return
      }

      if (!likedData || likedData.length === 0) {
        setLikedVideos([])
        return
      }

      // Get the video IDs
      const videoIds = likedData.map((like) => like.video_id)

      // Fetch the actual video data
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select(
          `
          id,
          title,
          description,
          thumbnail_url,
          video_url,
          duration,
          views,
          created_at,
          user_id,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
        )
        .in("id", videoIds)

      if (videosError) {
        console.error("Error fetching videos:", videosError)
        setError("Failed to fetch video details")
        return
      }

      // Combine the data
      const combinedData = likedData
        .map((like) => {
          const video = videosData?.find((v) => v.id === like.video_id)
          if (!video) return null
          return {
            id: `${userId}-${like.video_id}`,
            video_id: like.video_id,
            user_id: userId,
            created_at: like.created_at,
            videos: video,
          }
        })
        .filter(Boolean) as LikedVideo[]

      setLikedVideos(combinedData)
    } catch (err) {
      console.error("Error in fetchLikedVideos:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleUnlike = async (videoId: string) => {
    try {
      const { error } = await supabase.from("video_likes").delete().eq("user_id", userId).eq("video_id", videoId)

      if (error) {
        console.error("Error unliking video:", error)
        return
      }

      // Remove from local state
      setLikedVideos((prev) => prev.filter((video) => video.video_id !== videoId))
    } catch (err) {
      console.error("Error in handleUnlike:", err)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Heart className="mx-auto h-12 w-12 mb-2" />
          <p className="text-lg font-medium">Error loading liked videos</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <button
          onClick={fetchLikedVideos}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (likedVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No liked videos yet</h3>
        <p className="text-muted-foreground mb-6">
          Videos you like will appear here. Start exploring and like some videos!
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Explore Videos
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {likedVideos.map((likedVideo) => (
        <LikedVideoCard
          key={likedVideo.id}
          video={likedVideo.videos}
          onUnlike={() => handleUnlike(likedVideo.video_id)}
        />
      ))}
    </div>
  )
}
