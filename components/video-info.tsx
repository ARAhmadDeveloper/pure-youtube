"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Bell, BellOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WatchLaterButton } from "./watch-later-button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface VideoInfoProps {
  video: {
    id: string
    title: string
    description: string
    views: number
    likes: number
    dislikes?: number
    created_at: string
    profiles: {
      id: string
      username: string
      full_name?: string
      avatar_url?: string
      subscriber_count?: number
    }
  }
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndInteractions()
  }, [video.id])

  const checkUserAndInteractions = async () => {
    try {
      // Check session storage first
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
          // Store in session storage for future use
          sessionStorage.setItem("supabase.auth.user", JSON.stringify(authUser))
        }
      }

      if (currentUser) {
        setUser(currentUser)
        await checkInteractions(currentUser.id)
      }
    } catch (error) {
      console.error("Error checking user and interactions:", error)
    }
  }

  const checkInteractions = async (userId: string) => {
    try {
      // Check if user liked the video
      const { data: likeData } = await supabase
        .from("video_likes")
        .select("id")
        .eq("video_id", video.id)
        .eq("user_id", userId)
        .single()

      setIsLiked(!!likeData)

      // Check if user is subscribed to the channel
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("channel_id", video.profiles.id)
        .eq("subscriber_id", userId)
        .single()

      setIsSubscribed(!!subscriptionData)
    } catch (error) {
      console.error("Error checking interactions:", error)
    }
  }

  const handleLike = async () => {
    if (!user?.id || isLoading) return

    setIsLoading(true)
    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase.from("video_likes").delete().eq("video_id", video.id).eq("user_id", user.id)

        if (!error) {
          setIsLiked(false)
          setIsDisliked(false)
        }
      } else {
        // Add like
        const { error } = await supabase.from("video_likes").upsert({
          video_id: video.id,
          user_id: user.id,
          is_like: true,
        })

        if (!error) {
          setIsLiked(true)
          setIsDisliked(false)
        }
      }
    } catch (error) {
      console.error("Error handling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user?.id || isLoading) return

    setIsLoading(true)
    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("channel_id", video.profiles.id)
          .eq("subscriber_id", user.id)

        if (!error) {
          setIsSubscribed(false)
          toast({
            title: "Unsubscribed",
            description: `You've unsubscribed from ${video.profiles.username}`,
          })
        }
      } else {
        // Subscribe
        const { error } = await supabase.from("subscriptions").insert({
          channel_id: video.profiles.id,
          subscriber_id: user.id,
        })

        if (!error) {
          setIsSubscribed(true)
          toast({
            title: "Subscribed",
            description: `You're now subscribed to ${video.profiles.username}`,
          })
        }
      }
    } catch (error) {
      console.error("Error handling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) return "0"
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatSubscribers = (count: number | undefined) => {
    if (!count || count === 0) return "0"
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold mb-2">{video.title || "Untitled Video"}</h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-full">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-l-full px-4"
                onClick={handleLike}
                disabled={isLoading}
              >
                <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {video.likes || 0}
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button variant="ghost" size="sm" className="rounded-r-full px-4" disabled={isLoading}>
                <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
              </Button>
            </div>

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
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={video.profiles.avatar_url || "/placeholder.svg"} alt={video.profiles.username} />
            <AvatarFallback>{(video.profiles.username || "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{video.profiles.full_name || video.profiles.username || "Unknown User"}</h3>
            <p className="text-sm text-muted-foreground">
              {formatSubscribers(video.profiles.subscriber_count)} subscribers
            </p>
          </div>
        </div>

        {user?.id && user.id !== video.profiles.id && (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            variant={isSubscribed ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        )}
      </div>

      <div className="bg-muted rounded-lg p-4">
        <p className="text-sm whitespace-pre-wrap">{video.description || "No description available."}</p>
      </div>
    </div>
  )
}
