"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Eye, ThumbsUp, MessageCircle } from "lucide-react"

interface VideoCardProps {
  video: {
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
      username: string
      avatar_url: string
    }
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
      <Link href={`/watch/${video.id}`}>
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={video.thumbnail_url || "/placeholder.svg?height=180&width=320&query=video thumbnail"}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/70 rounded-full p-3">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <div className="flex space-x-3">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarImage src={video.profiles.avatar_url || "/placeholder.svg"} alt={video.profiles.username} />
                <AvatarFallback>{video.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">{video.profiles.username}</p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatCount(video.views)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{formatCount(video.likes)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{formatCount(video.comment_count)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
