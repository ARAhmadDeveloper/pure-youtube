"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreVertical, Eye, ThumbsUp, MessageCircle, Trash2, Share, Download, Globe, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface MyVideoCardProps {
  video: {
    id: string
    title: string
    description: string
    thumbnail_url: string
    video_url: string
    duration: number
    views: number
    likes: number
    comment_count: number
    is_public: boolean
    created_at: string
    user_id: string
    profiles: {
      username: string
      avatar_url: string
    }
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function MyVideoCard({ video }: MyVideoCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Delete video record from database
      const { error: dbError } = await supabase.from("videos").delete().eq("id", video.id)

      if (dbError) throw dbError

      // Delete video file from storage
      if (video.video_url) {
        const videoPath = video.video_url.split("/").pop()
        if (videoPath) {
          await supabase.storage.from("videos").remove([videoPath])
        }
      }

      // Delete thumbnail from storage
      if (video.thumbnail_url) {
        const thumbnailPath = video.thumbnail_url.split("/").pop()
        if (thumbnailPath) {
          await supabase.storage.from("thumbnails").remove([thumbnailPath])
        }
      }

      toast({
        title: "Video deleted",
        description: "Your video has been successfully deleted.",
      })

      // Refresh the page to update the video list
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete video",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/watch/${video.id}`

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

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      // Create a safe filename from the video title
      const safeTitle = video.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      const filename = `${safeTitle}.mp4`

      // Fetch the video file
      const response = await fetch(video.video_url)

      if (!response.ok) {
        throw new Error("Failed to fetch video")
      }

      // Get the blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download started",
        description: "Your video download has begun.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "Unable to download the video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Link href={`/watch/${video.id}`}>
              <Image
                src={video.thumbnail_url || "/placeholder.svg?height=180&width=320&query=video thumbnail"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </Link>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>

            {/* Visibility badge */}
            <div className="absolute top-2 left-2">
              <Badge variant={video.is_public ? "default" : "secondary"} className="text-xs">
                {video.is_public ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>

            {/* Actions menu */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <Link href={`/watch/${video.id}`}>
              <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors mb-2">
                {video.title}
              </h3>
            </Link>

            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mb-2">
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

            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{video.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
