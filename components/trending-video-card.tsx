"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Heart, MessageCircle, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface TrendingVideo {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  views_count: number
  likes_count: number
  comments_count: number
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

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function TrendingVideoCard({ video, rank }: TrendingVideoCardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-yellow-50"
    if (rank === 2) return "bg-gray-400 text-gray-50"
    if (rank === 3) return "bg-amber-600 text-amber-50"
    if (rank <= 10) return "bg-red-500 text-red-50"
    return "bg-muted text-muted-foreground"
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/watch/${video.id}`}>
          <div className="aspect-video relative overflow-hidden">
            <img
              src={
                video.thumbnail_url || `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(video.title)}`
              }
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Rank Badge */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${getRankColor(rank)}`}>
              #{rank}
            </div>

            {/* Duration */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(video.duration)}
            </div>

            {/* Trending Score */}
            <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {video.trending_score.toFixed(0)}
            </div>
          </div>
        </Link>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${video.username}`}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={video.avatar_url || "/placeholder.svg"} alt={video.username} />
              <AvatarFallback>{video.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={`/watch/${video.id}`}>
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
            </Link>

            <Link href={`/profile/${video.username}`}>
              <p className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
                {video.username}
              </p>
            </Link>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(video.views_count)}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {formatNumber(video.likes_count)}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {formatNumber(video.comments_count)}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
              </p>
              <Badge variant="secondary" className="text-xs">
                {video.engagement_rate.toFixed(1)}% engagement
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
