"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, UserPlus, UserCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WatchLaterButton } from "./watch-later-button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./auth-provider"
import { toast } from "@/hooks/use-toast" // Import toast from use-toast hook

interface VideoInfoProps {
  video: {
    id: string
    title: string
    description: string
    views: number
    likes: number
    created_at: string
    user_id: string
    profiles: {
      id: string
      username: string
      full_name?: string
      avatar_url?: string
    }
  }
}

export function VideoInfo({ video }: VideoInfoProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [dislikesCount, setDislikesCount] = useState(0)
  const [subscribersCount, setSubscribersCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      checkUserInteractions()
    }
    fetchCounts()
  }, [user, video.id])

  const checkUserInteractions = async () => {
    if (!user) return

    try {
      // Check if user liked/disliked the video
      const { data: likeData } = await supabase
        .from("video_likes")
        .select("is_like")
        .eq("user_id", user.id)
        .eq("video_id", video.id)
        .single()

      if (likeData) {
        setIsLiked(likeData.is_like === true)
        setIsDisliked(likeData.is_like === false)
      }

      // Check if user is subscribed to the channel
      if (video.profiles?.id && video.profiles.id !== user.id) {
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("subscriber_id", user.id)
          .eq("channel_id", video.profiles.id)
          .single()

        setIsSubscribed(!!subData)
      }
    } catch (error) {
      console.error("Error checking user interactions:", error)
    }
  }

  const fetchCounts = async () => {
    try {
      // Get likes count
      const { count: likesCount } = await supabase
        .from("video_likes")
        .select("*", { count: "exact", head: true })
        .eq("video_id", video.id)
        .eq("is_like", true)

      // Get dislikes count
      const { count: dislikesCount } = await supabase
        .from("video_likes")
        .select("*", { count: "exact", head: true })
        .eq("video_id", video.id)
        .eq("is_like", false)

      // Get subscribers count
      const { count: subscribersCount } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("channel_id", video.profiles?.id)

      setLikesCount(likesCount || 0)
      setDislikesCount(dislikesCount || 0)
      setSubscribersCount(subscribersCount || 0)
    } catch (error) {
      console.error("Error fetching counts:", error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like videos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase.from("video_likes").delete().eq("user_id", user.id).eq("video_id", video.id)

        if (error) throw error

        setIsLiked(false)
        setLikesCount((prev) => Math.max(0, prev - 1))
      } else {
        // Add like or change from dislike to like
        const { error } = await supabase.from("video_likes").upsert(
          {
            user_id: user.id,
            video_id: video.id,
            is_like: true,
          },
          {
            onConflict: "user_id,video_id",
          },
        )

        if (error) throw error

        if (isDisliked) {
          setIsDisliked(false)
          setDislikesCount((prev) => Math.max(0, prev - 1))
        }
        setIsLiked(true)
        setLikesCount((prev) => prev + (isDisliked ? 1 : 1))
      }
    } catch (error) {
      console.error("Error handling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDislike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to dislike videos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isDisliked) {
        // Remove dislike
        const { error } = await supabase.from("video_likes").delete().eq("user_id", user.id).eq("video_id", video.id)

        if (error) throw error

        setIsDisliked(false)
        setDislikesCount((prev) => Math.max(0, prev - 1))
      } else {
        // Add dislike or change from like to dislike
        const { error } = await supabase.from("video_likes").upsert(
          {
            user_id: user.id,
            video_id: video.id,
            is_like: false,
          },
          {
            onConflict: "user_id,video_id",
          },
        )

        if (error) throw error

        if (isLiked) {
          setIsLiked(false)
          setLikesCount((prev) => Math.max(0, prev - 1))
        }
        setIsDisliked(true)
        setDislikesCount((prev) => prev + (isLiked ? 1 : 1))
      }
    } catch (error) {
      console.error("Error handling dislike:", error)
      toast({
        title: "Error",
        description: "Failed to update dislike status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to channels",
        variant: "destructive",
      })
      return
    }

    if (!video.profiles?.id) {
      toast({
        title: "Error",
        description: "Cannot subscribe to this channel",
        variant: "destructive",
      })
      return
    }

    if (video.profiles.id === user.id) {
      toast({
        title: "Error",
        description: "You cannot subscribe to your own channel",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("subscriber_id", user.id)
          .eq("channel_id", video.profiles.id)

        if (error) throw error

        setIsSubscribed(false)
        setSubscribersCount((prev) => Math.max(0, prev - 1))
        toast({
          title: "Unsubscribed",
          description: `You unsubscribed from ${video.profiles.full_name || video.profiles.username}`,
        })
      } else {
        // Subscribe
        const { error } = await supabase.from("subscriptions").insert({
          subscriber_id: user.id,
          channel_id: video.profiles.id,
        })

        if (error) throw error

        setIsSubscribed(true)
        setSubscribersCount((prev) => prev + 1)
        toast({
          title: "Subscribed",
          description: `You subscribed to ${video.profiles.full_name || video.profiles.username}`,
        })
      }
    } catch (error) {
      console.error("Error handling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatDate(video.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleLike}
              disabled={loading}
              variant={isLiked ? "default" : "outline"}
              size="sm"
              className="flex items-center space-x-2"
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </Button>

            <Button
              onClick={handleDislike}
              disabled={loading}
              variant={isDisliked ? "default" : "outline"}
              size="sm"
              className="flex items-center space-x-2"
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
              <span>{dislikesCount}</span>
            </Button>

            <WatchLaterButton videoId={video.id} />

            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={video.profiles?.avatar_url || "/placeholder.svg"} alt={video.profiles?.username} />
            <AvatarFallback>{video.profiles?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{video.profiles?.full_name || video.profiles?.username || "Unknown User"}</p>
            <p className="text-sm text-muted-foreground">{subscribersCount} subscribers</p>
          </div>
        </div>

        {user && video.profiles?.id !== user.id && (
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            variant={isSubscribed ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            {isSubscribed ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Subscribed
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
        )}
      </div>

      {video.description && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm whitespace-pre-wrap">{video.description}</p>
        </div>
      )}
    </div>
  )
}
