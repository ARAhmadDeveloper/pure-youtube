"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Eye, Share2, UserPlus, UserMinus, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface VideoInfoProps {
  video: {
    id: string
    title: string
    description?: string
    views?: number
    likes?: number
    comment_count?: number
    created_at: string
    user_id: string
    profiles: {
      id: string
      username: string
      full_name?: string
      avatar_url?: string
      bio?: string
    }
  }
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likeCount, setLikeCount] = useState(video?.likes || 0)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()

  // Safe access to video data
  const videoData = {
    id: video?.id || "",
    title: video?.title || "Untitled Video",
    description: video?.description || "",
    views: video?.views || 0,
    likes: video?.likes || 0,
    comment_count: video?.comment_count || 0,
    created_at: video?.created_at || new Date().toISOString(),
    user_id: video?.user_id || "",
    profiles: {
      id: video?.profiles?.id || "",
      username: video?.profiles?.username || "Unknown User",
      full_name: video?.profiles?.full_name || "",
      avatar_url: video?.profiles?.avatar_url || "",
      bio: video?.profiles?.bio || "",
    },
  }

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return "0"
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Unknown date"
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setCurrentUser(user)

          // Check if user has liked this video
          const { data: likeData } = await supabase
            .from("video_likes")
            .select("is_like")
            .eq("user_id", user.id)
            .eq("video_id", videoData.id)
            .single()

          if (likeData) {
            setIsLiked(likeData.is_like)
          }

          // Check if user is subscribed to the video owner
          if (videoData.profiles.id && videoData.profiles.id !== user.id) {
            const { data: subData } = await supabase
              .from("subscriptions")
              .select("id")
              .eq("subscriber_id", user.id)
              .eq("channel_id", videoData.profiles.id)
              .single()

            setIsSubscribed(!!subData)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (videoData.id) {
      fetchUserData()
    }
  }, [videoData.id, videoData.profiles.id])

  const handleLike = async () => {
    if (!currentUser || isLoading) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      // Check if like record exists
      const { data: existingLike } = await supabase
        .from("video_likes")
        .select("is_like")
        .eq("user_id", currentUser.id)
        .eq("video_id", videoData.id)
        .single()

      if (existingLike) {
        // Update existing record
        const newLikeStatus = !existingLike.is_like
        const { error } = await supabase
          .from("video_likes")
          .update({ is_like: newLikeStatus })
          .eq("user_id", currentUser.id)
          .eq("video_id", videoData.id)

        if (error) throw error

        setIsLiked(newLikeStatus)
        setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1))
      } else {
        // Create new like record
        const { error } = await supabase.from("video_likes").insert({
          user_id: currentUser.id,
          video_id: videoData.id,
          is_like: true,
        })

        if (error) throw error

        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
      }

      toast({
        title: isLiked ? "Removed from liked videos" : "Added to liked videos",
        description: isLiked ? "Video unliked successfully" : "Video liked successfully",
      })
    } catch (error) {
      console.error("Error handling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!currentUser || isLoading || !videoData.profiles.id || videoData.profiles.id === currentUser.id) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("subscriber_id", currentUser.id)
          .eq("channel_id", videoData.profiles.id)

        if (error) throw error
        setIsSubscribed(false)

        toast({
          title: "Unsubscribed",
          description: `You unsubscribed from ${videoData.profiles.username}`,
        })
      } else {
        // Subscribe
        const { error } = await supabase.from("subscriptions").insert({
          subscriber_id: currentUser.id,
          channel_id: videoData.profiles.id,
        })

        if (error) throw error
        setIsSubscribed(true)

        toast({
          title: "Subscribed",
          description: `You subscribed to ${videoData.profiles.username}`,
        })
      }
    } catch (error) {
      console.error("Error handling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: videoData.title,
          text: `Check out this video: ${videoData.title}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Video link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Error",
        description: "Failed to share video",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Video Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{videoData.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(videoData.views)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(videoData.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{formatNumber(likeCount)}</span>
          </Button>

          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <MessageCircle className="w-4 h-4" />
            <span>{formatNumber(videoData.comment_count)}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Channel Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={videoData.profiles.avatar_url || "/placeholder.svg"} alt={videoData.profiles.username} />
            <AvatarFallback>{videoData.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">
              {videoData.profiles.full_name || videoData.profiles.username}
            </h3>
            <p className="text-sm text-muted-foreground">@{videoData.profiles.username}</p>
            {videoData.profiles.bio && <p className="text-sm text-muted-foreground mt-1">{videoData.profiles.bio}</p>}
          </div>
        </div>

        {currentUser && videoData.profiles.id !== currentUser.id && (
          <Button
            variant={isSubscribed ? "outline" : "default"}
            size="sm"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isSubscribed ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isSubscribed ? "Unsubscribe" : "Subscribe"}</span>
          </Button>
        )}
      </div>

      {/* Video Description */}
      {videoData.description && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-foreground whitespace-pre-wrap">{videoData.description}</p>
        </div>
      )}
    </div>
  )
}
