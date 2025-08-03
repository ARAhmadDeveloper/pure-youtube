"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Play, Eye, MessageCircle, Clock, MoreVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface LikedVideoCardProps {
  video: LikedVideo
  onUnlike: (videoId: string) => void
}

export function LikedVideoCard({ video, onUnlike }: LikedVideoCardProps) {
  const [isUnliking, setIsUnliking] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

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

  const handleUnlike = async () => {
    setIsUnliking(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to unlike videos",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.rpc("toggle_video_like", {
        user_uuid: user.id,
        video_uuid: video.id,
      })

      if (error) {
        console.error("Error unliking video:", error)
        toast({
          title: "Error",
          description: "Failed to unlike video",
          variant: "destructive",
        })
        return
      }

      onUnlike(video.id)
    } catch (error) {
      console.error("Error unliking video:", error)
      toast({
        title: "Error",
        description: "Failed to unlike video",
        variant: "destructive",
      })
    } finally {
      setIsUnliking(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/watch/${video.id}`}>
            <div className="relative aspect-video bg-muted overflow-hidden">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/80 rounded-full p-3">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
          </Link>

          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUnlike} disabled={isUnliking}>
                  <Heart className="w-4 h-4 mr-2" />
                  {isUnliking ? "Removing..." : "Remove from liked"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-4">
          <Link href={`/watch/${video.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
          </Link>

          <Link href={`/profile/${video.username}`}>
            <div className="flex items-center space-x-2 mb-3 group/creator hover:text-primary transition-colors">
              <Avatar className="w-6 h-6">
                <AvatarImage src={video.avatar_url || "/placeholder.svg"} alt={video.full_name} />
                <AvatarFallback className="text-xs">
                  {video.full_name?.charAt(0) || video.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground group-hover/creator:text-primary transition-colors">
                {video.full_name || video.username}
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViews(video.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{formatViews(video.likes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{video.comment_count}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Liked {formatTimeAgo(video.liked_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
