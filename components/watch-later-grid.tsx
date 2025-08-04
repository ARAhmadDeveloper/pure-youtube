"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { WatchLaterVideoCard } from "./watch-later-video-card"
import { Clock, Loader2 } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  thumbnail_url: string
  duration: number
  views: number
  likes: number
  comment_count: number
  created_at: string
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
}

interface WatchLaterVideo {
  id: string
  video_id: string
  created_at: string
  video: Video
}

export function WatchLaterGrid() {
  const [videos, setVideos] = useState<WatchLaterVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    checkUserAndFetchVideos()
  }, [])

  const checkUserAndFetchVideos = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check session storage first
      const sessionUser = sessionStorage.getItem("supabase.auth.user")
      let currentUser = null

      if (sessionUser) {
        try {
          currentUser = JSON.parse(sessionUser)
        } catch (e) {
          console.error("Error parsing session user:", e)
          sessionStorage.removeItem("supabase.auth.user")
        }
      }

      if (!currentUser) {
        // Fallback to Supabase auth
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (authUser) {
          currentUser = authUser
          // Store in session storage for future use
          sessionStorage.setItem("supabase.auth.user", JSON.stringify(authUser))
        }
      }

      if (currentUser) {
        setUser(currentUser)
        await fetchWatchLaterVideos(currentUser.id)
      } else {
        setError("Please sign in to view your Watch Later videos")
      }
    } catch (error) {
      console.error("Error checking user and fetching videos:", error)
      setError("Failed to load Watch Later videos")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWatchLaterVideos = async (userId: string) => {
    try {
      // First get the watch_later entries
      const { data: watchLaterData, error: watchLaterError } = await supabase
        .from("watch_later")
        .select("id, video_id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (watchLaterError) {
        throw watchLaterError
      }

      if (!watchLaterData || watchLaterData.length === 0) {
        setVideos([])
        return
      }

      // Get video IDs
      const videoIds = watchLaterData.map((item) => item.video_id)

      // Fetch video details with profiles
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select(
          `
          id,
          title,
          description,
          thumbnail_url,
          duration,
          views,
          likes,
          comment_count,
          created_at,
          user_id,
          profiles!videos_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
        )
        .in("id", videoIds)

      if (videosError) {
        throw videosError
      }

      // Combine watch_later data with video data
      const combinedData = watchLaterData
        .map((watchLaterItem) => {
          const video = videosData?.find((v) => v.id === watchLaterItem.video_id)
          if (video) {
            return {
              id: watchLaterItem.id,
              video_id: watchLaterItem.video_id,
              created_at: watchLaterItem.created_at,
              video: {
                ...video,
                profiles: video.profiles,
              },
            }
          }
          return null
        })
        .filter(Boolean) as WatchLaterVideo[]

      setVideos(combinedData)
    } catch (error) {
      console.error("Error fetching watch later videos:", error)
      setError("Failed to load Watch Later videos")
    }
  }

  const handleRemoveVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((item) => item.video_id !== videoId))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading your Watch Later videos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Videos</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No videos saved</h3>
        <p className="text-muted-foreground">Videos you save for later will appear here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((item) => (
        <WatchLaterVideoCard
          key={item.id}
          video={item.video}
          addedAt={item.created_at}
          onRemove={() => handleRemoveVideo(item.video_id)}
        />
      ))}
    </div>
  )
}
