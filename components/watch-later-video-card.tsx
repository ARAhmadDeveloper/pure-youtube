"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, ThumbsUp, MessageCircle, Play, X, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

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
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
}

interface WatchLaterVideoCardProps {
  video: Video
  addedAt: string
  onRemove: () => void
}

export function WatchLaterVideoCard({ video, addedAt, onRemove }: WatchLaterVideoCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isRemoving) return

    setIsRemoving(true)
    try {
      // Get user from session storage
      const sessionUser = sessionStorage.getItem("supabase.auth.user")
      let currentUser = null

      if (sessionUser) {
        try {
          currentUser = JSON.parse(sessionUser)
        } catch (e) {
          console.error("Error parsing session user:", e)
          sessionStorage.removeItem("supabase.auth.user")
        }
      }

      if (!currentUser) {
        // Fallback to Supabase auth
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (authUser) {
          currentUser = authUser
          sessionStorage.setItem("supabase.auth.user", JSON.stringify(authUser))
        }
      }

      if (!currentUser) {
        toast({
          title: "Error",
          description: "Please sign in to remove videos",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("watch_later")
        .delete()
        .eq("video_id", video.id)
        .eq("user_id", currentUser.id)

      if (error) {
        throw error
      }

      onRemove()
      toast({
        title: "Removed from Watch Later",
        description: "Video removed from your Watch Later list",
      })
    } catch (error) {
      console.error("Error removing video:", error)
      toast({
        title: "Error",
        description: "Failed to remove video from Watch Later",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg relative">
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

            {/* Remove button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors mb-2">
              {video.title}
            </h3>

            {/* Channel Info */}
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={video.profiles.avatar_url || "/placeholder.svg"} alt={video.profiles.username} />
                <AvatarFallback className="text-xs">
                  {(video.profiles.username || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {video.profiles.full_name || video.profiles.username}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
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

            {/* Added date */}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Added {formatDistanceToNow(new Date(addedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
