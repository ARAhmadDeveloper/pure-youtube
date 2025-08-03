"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { LikedVideoCard } from "./liked-video-card"
import { Button } from "@/components/ui/button"
import { Loader2, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LikedVideo {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  views: number
  likes: number
  comment_count: number
  created_at: string
  user_id: string
  username: string
  full_name: string
  avatar_url: string
  liked_at: string
}

interface LikedVideosGridProps {
  userId: string
}

export function LikedVideosGrid({ userId }: LikedVideosGridProps) {
  const [videos, setVideos] = useState<LikedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const { toast } = useToast()
  const supabase = createClient()

  const VIDEOS_PER_PAGE = 12

  useEffect(() => {
    fetchLikedVideos()
  }, [userId])

  const fetchLikedVideos = async (pageNum = 0, append = false) => {
    try {
      if (pageNum === 0) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const { data, error } = await supabase.rpc("get_liked_videos", {
        user_uuid: userId,
        page_limit: VIDEOS_PER_PAGE,
        page_offset: pageNum * VIDEOS_PER_PAGE,
      })

      if (error) {
        console.error("Error fetching liked videos:", error)
        toast({
          title: "Error",
          description: "Failed to load liked videos",
          variant: "destructive",
        })
        return
      }

      const likedVideos = data || []

      if (append) {
        setVideos((prev) => [...prev, ...likedVideos])
      } else {
        setVideos(likedVideos)
      }

      setHasMore(likedVideos.length === VIDEOS_PER_PAGE)
      setPage(pageNum)
    } catch (error) {
      console.error("Error fetching liked videos:", error)
      toast({
        title: "Error",
        description: "Failed to load liked videos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchLikedVideos(page + 1, true)
    }
  }

  const handleVideoUnliked = (videoId: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== videoId))
    toast({
      title: "Video unliked",
      description: "Video removed from your liked videos",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading liked videos...</span>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Heart className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No liked videos yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start exploring and like videos to see them here. Your liked videos will be saved for easy access later.
        </p>
        <Button asChild>
          <a href="/">Discover Videos</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <LikedVideoCard key={video.id} video={video} onUnlike={handleVideoUnliked} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline" size="lg">
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load More Videos"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
