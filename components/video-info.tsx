"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, Share, Flag, Eye, Calendar, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { WatchLaterButton } from "./watch-later-button"

interface VideoInfoProps {
  video: {
    id: string
    title: string
    description: string
    views: number
    likes: number
    comment_count: number
    tags: string[]
    created_at: string
    user_id: string
    profiles: {
      username: string
      full_name: string
      avatar_url: string
      bio: string
    }
  }
  currentUser: SupabaseUser
}

export function VideoInfo({ video, currentUser }: VideoInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.likes)
  const [commentCount, setCommentCount] = useState(video.comment_count)
  const [viewCount, setViewCount] = useState(video.views)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkUserInteractions()
    // Set up real-time subscription for video stats
    const channel = supabase
      .channel(`video-${video.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
          filter: `id=eq.${video.id}`,
        },
        (payload) => {
          console.log("Video stats updated:", payload)
          if (payload.new) {
            setLikeCount(payload.new.likes || 0)
            setCommentCount(payload.new.comment_count || 0)
            setViewCount(payload.new.views || 0)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [video.id, currentUser.id])

  const checkUserInteractions = async () => {
    try {
      // Check if user has liked this video
      const { data: likeData } = await supabase
        .from("video_likes")
        .select("id")
        .eq("video_id", video.id)
        .eq("user_id", currentUser.id)
        .single()

      setIsLiked(!!likeData)

      // Check if user is subscribed to this channel
      if (video.user_id !== currentUser.id) {
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("subscriber_id", currentUser.id)
          .eq("channel_id", video.user_id)
          .single()

        setIsSubscribed(!!subData)
      }

      // Fetch current video stats
      const { data: videoData } = await supabase
        .from("videos")
        .select("views, likes, comment_count")
        .eq("id", video.id)
        .single()

      if (videoData) {
        setViewCount(videoData.views || 0)
        setLikeCount(videoData.likes || 0)
        setCommentCount(videoData.comment_count || 0)
      }
    } catch (error) {
      console.error("Error checking user interactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handleLike = async () => {
    if (isLoading) return

    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from("video_likes")
          .delete()
          .eq("video_id", video.id)
          .eq("user_id", currentUser.id)

        if (!error) {
          setIsLiked(false)
          setLikeCount((prev) => Math.max(0, prev - 1))
          toast({
            title: "Like removed",
            description: "You unliked this video",
          })
        }
      } else {
        // Add like
        const { error } = await supabase.from("video_likes").insert({
          video_id: video.id,
          user_id: currentUser.id,
        })

        if (!error) {
          setIsLiked(true)
          setLikeCount((prev) => prev + 1)
          toast({
            title: "Video liked",
            description: "You liked this video",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: shareUrl,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied",
          description: "Video link copied to clipboard",
        })
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard",
      })
    }
  }

  const handleSubscribe = async () => {
    if (isLoading) return

    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("subscriber_id", currentUser.id)
          .eq("channel_id", video.user_id)

        if (!error) {
          setIsSubscribed(false)
          toast({
            title: "Unsubscribed",
            description: `You unsubscribed from ${video.profiles.username}`,
          })
        }
      } else {
        // Subscribe
        const { error } = await supabase.from("subscriptions").insert({
          subscriber_id: currentUser.id,
          channel_id: video.user_id,
        })

        if (!error) {
          setIsSubscribed(true)
          toast({
            title: "Subscribed",
            description: `You subscribed to ${video.profiles.username}`,
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Video Title and Stats */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-3">{video.title}</h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatCount(viewCount)} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{formatCount(likeCount)} likes</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatCount(commentCount)} comments</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{formatCount(likeCount)}</span>
          </Button>

          <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
            <ThumbsDown className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2 bg-transparent"
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </Button>
          <WatchLaterButton videoId={video.id} currentUser={currentUser} />
        </div>

        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </Button>
      </div>

      <Separator />

      {/* Channel Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={video.profiles.avatar_url || "/placeholder.svg"} alt={video.profiles.username} />
            <AvatarFallback>
              <Calendar className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{video.profiles.full_name || video.profiles.username}</h3>
            <p className="text-sm text-muted-foreground">@{video.profiles.username}</p>
            {video.profiles.bio && <p className="text-sm text-muted-foreground mt-1">{video.profiles.bio}</p>}
          </div>
        </div>

        {video.user_id !== currentUser.id && (
          <Button
            variant={isSubscribed ? "outline" : "default"}
            onClick={handleSubscribe}
            disabled={isLoading}
            className="ml-4"
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        )}
      </div>

      {/* Description */}
      {video.description && (
        <div className="bg-muted rounded-lg p-4">
          <div className={showFullDescription ? "" : "line-clamp-3"}>
            <p className="text-sm whitespace-pre-wrap">{video.description}</p>
          </div>
          {video.description.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 p-0 h-auto text-primary"
            >
              {showFullDescription ? "Show less" : "Show more"}
            </Button>
          )}
        </div>
      )}

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
