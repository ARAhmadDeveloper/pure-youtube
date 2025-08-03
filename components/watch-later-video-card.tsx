"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Eye, ThumbsUp, MessageCircle, Clock, X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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
  added_at: string
  profiles: {
    username: string
    avatar_url: string
    full_name: string
  }
}

interface WatchLaterVideoCardProps {
  video: Video
  onRemove: (videoId: string) => void
}

export function WatchLaterVideoCard({ video, onRemove }: WatchLaterVideoCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const handleRemoveFromWatchLater = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsRemoving(true)

    // Simulate API call delay
    setTimeout(() => {
      onRemove(video.id)
      setIsRemoving(false)
    }, 500)
  }

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <Link href={`/watch/${video.id}`}>
        <div className="relative aspect-video">
          <Image src={video.thumbnail_url || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/80 rounded-full p-3">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Added {formatDistanceToNow(new Date(video.added_at), { addSuffix: true })}
          </div>
        </div>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
        onClick={handleRemoveFromWatchLater}
        disabled={isRemoving}
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="p-4">
        <Link href={`/watch/${video.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>

        <Link href={`/profile/${video.profiles.username}`} className="flex items-center gap-2 mb-3">
          <Image
            src={video.profiles.avatar_url || "/placeholder.svg"}
            alt={video.profiles.username}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {video.profiles.username}
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{formatViews(video.views)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{video.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{video.comment_count}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Uploaded {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}
