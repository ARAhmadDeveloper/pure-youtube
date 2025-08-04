"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface WatchLaterButtonProps {
  videoId: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function WatchLaterButton({ videoId, size = "sm", variant = "outline" }: WatchLaterButtonProps) {
  const [isInWatchLater, setIsInWatchLater] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndWatchLaterStatus()
  }, [videoId])

  const checkUserAndWatchLaterStatus = async () => {
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
        await checkWatchLaterStatus(currentUser.id)
      }
    } catch (error) {
      console.error("Error checking user and watch later status:", error)
    }
  }

  const checkWatchLaterStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("watch_later")
        .select("id")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .single()

      if (!error && data) {
        setIsInWatchLater(true)
      } else {
        setIsInWatchLater(false)
      }
    } catch (error) {
      console.error("Error checking watch later status:", error)
      setIsInWatchLater(false)
    }
  }

  const handleWatchLater = async () => {
    if (!user?.id || isLoading) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save videos for later",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (isInWatchLater) {
        // Remove from watch later
        const { error } = await supabase.from("watch_later").delete().eq("video_id", videoId).eq("user_id", user.id)

        if (!error) {
          setIsInWatchLater(false)
          toast({
            title: "Removed from Watch Later",
            description: "Video removed from your Watch Later list",
          })
        } else {
          throw error
        }
      } else {
        // Add to watch later
        const { error } = await supabase.from("watch_later").insert({
          video_id: videoId,
          user_id: user.id,
        })

        if (!error) {
          setIsInWatchLater(true)
          toast({
            title: "Added to Watch Later",
            description: "Video saved to your Watch Later list",
          })
        } else {
          throw error
        }
      }
    } catch (error) {
      console.error("Error handling watch later:", error)
      toast({
        title: "Error",
        description: "Failed to update Watch Later list",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleWatchLater} disabled={isLoading}>
      {isInWatchLater ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Saved
        </>
      ) : (
        <>
          <Clock className="w-4 h-4 mr-2" />
          Watch Later
        </>
      )}
    </Button>
  )
}
