"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Eye, ThumbsUp, MessageCircle, Play, Users } from "lucide-react"

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
    username: string
    avatar_url: string
    full_name: string
    subscriber_count: number
  }
}

interface SubscriptionVideoCardProps {
  video: Video
}

export function SubscriptionVideoCard({ video }: SubscriptionVideoCardProps) {
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

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
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
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">New</div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Link href={`/profile/${video.profiles.username}`}>
            <Image
              src={video.profiles.avatar_url || "/placeholder.svg"}
              alt={video.profiles.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${video.profiles.username}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm hover:text-primary transition-colors">
                  {video.profiles.full_name}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {formatSubscribers(video.profiles.subscriber_count)}
                </div>
              </div>
            </Link>
          </div>
        </div>

        <Link href={`/watch/${video.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
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

        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}
