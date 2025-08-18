"use client"

import { VideoCard } from "./video-card"

interface Video {
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
  profiles: {
    id: string
    username: string
    avatar_url: string
  }
}

interface VideoGridProps {
  videos?: Video[]
}

export function VideoGrid({ videos = [] }: VideoGridProps) {
  // Handle undefined or null videos
  const safeVideos = videos || []

  if (!safeVideos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No videos found</h3>
          <p className="text-sm text-muted-foreground">Be the first to upload a video to VideoMe!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
