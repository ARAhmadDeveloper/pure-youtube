"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye } from "lucide-react"

interface RelatedVideo {
  id: string
  title: string
  thumbnail_url: string
  duration: number
  views: number
  created_at: string
  profiles: {
    username: string
    avatar_url: string
  }
}

interface RelatedVideosProps {
  videos: RelatedVideo[]
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export function RelatedVideos({ videos }: RelatedVideosProps) {
  if (!videos.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Related Videos</h3>
        <p className="text-muted-foreground text-sm">No related videos found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Related Videos</h3>

      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="flex space-x-3 p-2 rounded-lg hover:bg-muted transition-colors group"
          >
            {/* Thumbnail */}
            <div className="relative w-40 aspect-video flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={video.thumbnail_url || "/placeholder.svg?height=90&width=160&query=video thumbnail"}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="160px"
              />

              {/* Duration */}
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h4>

              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={video.profiles.avatar_url || "/placeholder.svg"} alt={video.profiles.username} />
                  <AvatarFallback className="text-xs">{video.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">{video.profiles.username}</span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(video.views)}</span>
                </div>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
