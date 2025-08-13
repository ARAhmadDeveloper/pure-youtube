"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Play, Eye, Clock } from "lucide-react"

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

interface LikedVideoCardProps {
  video: Video
  onUnlike: () => void
}

export function LikedVideoCard({ video, onUnlike }: LikedVideoCardProps) {
  const [isUnliking, setIsUnliking] = useState(false)

  const handleUnlike = async () => {
    setIsUnliking(true)
    try {
      await onUnlike()
    } catch (error) {
      console.error("Error unliking video:", error)
    } finally {
      setIsUnliking(false)
    }
  }

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/watch/${video.id}`}>
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <img
                src={video.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatDuration(video.duration)}
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            onClick={handleUnlike}
            disabled={isUnliking}
          >
            <Heart className={`w-4 h-4 ${isUnliking ? "animate-pulse" : "fill-red-500 text-red-500"}`} />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <Link href={`/watch/${video.id}`}>
            <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{video.title}</h3>
          </Link>

          <div className="flex items-center space-x-2">
            <Link href={`/profile/${video.profiles?.username}`}>
              <Avatar className="w-6 h-6">
                <AvatarImage src={video.profiles?.avatar_url || "/placeholder.svg"} alt={video.profiles?.username} />
                <AvatarFallback className="text-xs">
                  {video.profiles?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${video.profiles?.username}`}>
                <p className="text-xs text-muted-foreground hover:text-primary transition-colors truncate">
                  {video.profiles?.full_name || video.profiles?.username || "Unknown User"}
                </p>
              </Link>
            </div>
          </div>

          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {formatViews(video.views)} views
            </div>
            <span>•</span>
            <span>{formatTimeAgo(video.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
