"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, ThumbsUp, Reply } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    username: string
    avatar_url: string
  }
}

interface VideoCommentsProps {
  videoId: string
}

export function VideoComments({ videoId }: VideoCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      console.log("Fetching comments for video:", videoId)

      const { data, error } = await supabase
        .from("comments")
        .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          username,
          avatar_url
        )
      `)
        .eq("video_id", videoId)
        .is("parent_id", null)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        })
      } else {
        console.log("Fetched comments:", data?.length || 0)
        setComments(data || [])
      }
    } catch (error) {
      console.error("Error in fetchComments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)

    try {
      console.log("Submitting comment:", { videoId, userId: user.id, content: newComment.trim() })

      const { data, error } = await supabase
        .from("comments")
        .insert({
          video_id: videoId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          username,
          avatar_url
        )
      `)
        .single()

      if (error) {
        console.error("Error submitting comment:", error)
        toast({
          title: "Error",
          description: "Failed to post comment",
          variant: "destructive",
        })
      } else {
        console.log("Comment submitted successfully:", data)
        setNewComment("")
        // Add the new comment to the top of the list
        setComments((prev) => [data, ...prev])
        toast({
          title: "Comment posted",
          description: "Your comment has been added",
        })
      }
    } catch (error) {
      console.error("Error in handleSubmitComment:", error)
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Loading Comments...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">{comments.length} Comments</h3>
      </div>

      {/* Add Comment */}
      {user && (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt="Your avatar" />
              <AvatarFallback>{user.user_metadata?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setNewComment("")} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
                  {isSubmitting ? "Posting..." : "Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} alt={comment.profiles.username} />
              <AvatarFallback>{comment.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{comment.profiles.username}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm mb-2">{comment.content}</p>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  <span className="text-xs">0</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Reply className="w-3 h-3 mr-1" />
                  <span className="text-xs">Reply</span>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
