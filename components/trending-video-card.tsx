"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Heart, MessageCircle, TrendingUp, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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

interface TrendingVideoCardProps {
  video: TrendingVideo
  rank: number
}

export function TrendingVideoCard({ video, rank }: TrendingVideoCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getRankColor = (rank: number) => {
    if (rank <= 3) return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
    if (rank <= 10) return "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
    return "bg-muted text-muted-foreground"
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Rank Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge className={`${getRankColor(rank)} font-bold text-xs px-2 py-1`}>#{rank}</Badge>
        </div>

        {/* Trending Score Badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {video.trending_score.toFixed(1)}
          </Badge>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 z-10">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </Badge>
        </div>

        <Link href={`/watch/${video.id}`}>
          <div className="aspect-video relative overflow-hidden">
            {!imageError && video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-muted-foreground text-4xl">📹</div>
              </div>
            )}
          </div>
        </Link>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Video Title */}
        <Link href={`/watch/${video.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>

        {/* Creator Info */}
        <Link href={`/profile/${video.username}`}>
          <div className="flex items-center space-x-2 group/creator">
            <Avatar className="w-6 h-6">
              <AvatarImage src={video.avatar_url || "/placeholder.svg"} alt={video.username} />
              <AvatarFallback className="text-xs">{video.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground group-hover/creator:text-primary transition-colors">
              {video.username}
            </span>
          </div>
        </Link>

        {/* Video Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(video.view_count)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{formatNumber(video.like_count)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{formatNumber(video.comment_count)}</span>
            </div>
          </div>
          <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
        </div>

        {/* Engagement Rate */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Engagement: {video.engagement_rate.toFixed(1)}%</div>
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(video.engagement_rate, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
