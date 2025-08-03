"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface WatchLaterButtonProps {
  videoId: string
  currentUser: any
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "default" | "lg"
  showText?: boolean
  className?: string
}

export function WatchLaterButton({
  videoId,
  currentUser,
  variant = "outline",
  size = "sm",
  showText = true,
  className,
}: WatchLaterButtonProps) {
  const [isInWatchLater, setIsInWatchLater] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkWatchLaterStatus()
  }, [videoId, currentUser?.id])

  const checkWatchLaterStatus = async () => {
    if (!currentUser?.id) return

    try {
      const { data, error } = await supabase
        .from("watch_later")
        .select("id")
        .eq("video_id", videoId)
        .eq("user_id", currentUser.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking watch later status:", error)
        return
      }

      setIsInWatchLater(!!data)
    } catch (error) {
      console.error("Error checking watch later status:", error)
    }
  }

  const handleToggleWatchLater = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!currentUser?.id || isLoading) return

    setIsLoading(true)

    try {
      if (isInWatchLater) {
        // Remove from watch later
        const { error } = await supabase
          .from("watch_later")
          .delete()
          .eq("video_id", videoId)
          .eq("user_id", currentUser.id)

        if (error) {
          console.error("Error removing from watch later:", error)
          toast({
            title: "Error",
            description: "Failed to remove from watch later",
            variant: "destructive",
          })
          return
        }

        setIsInWatchLater(false)
        toast({
          title: "Removed from Watch Later",
          description: "Video removed from your watch later list",
        })
      } else {
        // Add to watch later
        const { error } = await supabase.from("watch_later").insert({
          video_id: videoId,
          user_id: currentUser.id,
        })

        if (error) {
          console.error("Error adding to watch later:", error)
          toast({
            title: "Error",
            description: "Failed to add to watch later",
            variant: "destructive",
          })
          return
        }

        setIsInWatchLater(true)
        toast({
          title: "Added to Watch Later",
          description: "Video saved to your watch later list",
        })
      }
    } catch (error) {
      console.error("Error toggling watch later:", error)
      toast({
        title: "Error",
        description: "Failed to update watch later status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser?.id) return null

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWatchLater}
      disabled={isLoading}
      className={cn("flex items-center space-x-2", className)}
    >
      {isInWatchLater ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
      {showText && <span>{isInWatchLater ? "Saved" : "Watch Later"}</span>}
    </Button>
  )
}
