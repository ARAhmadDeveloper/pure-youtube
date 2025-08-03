import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { VideoInfo } from "@/components/video-info"
import { VideoComments } from "@/components/video-comments"
import { RelatedVideos } from "@/components/related-videos"

interface WatchPageProps {
  params: {
    id: string
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  console.log("Loading video:", id, "for user:", user.id)

  // Fetch video details with all stats
  const { data: video, error } = await supabase
    .from("videos")
    .select(`
      id,
      title,
      description,
      video_url,
      thumbnail_url,
      duration,
      views,
      likes,
      comment_count,
      is_public,
      tags,
      created_at,
      user_id,
      profiles!inner (
        username,
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq("id", id)
    .single()

  if (error || !video) {
    console.error("Error fetching video:", error)
    notFound()
  }

  console.log("Video loaded:", {
    id: video.id,
    title: video.title,
    views: video.views,
    likes: video.likes,
    comment_count: video.comment_count,
    owner: video.user_id,
    viewer: user.id,
  })

  // Check if user can view this video
  if (!video.is_public && video.user_id !== user.id) {
    notFound()
  }

  // Increment view count (only if not the owner)
  if (video.user_id !== user.id) {
    console.log("Incrementing view count for video:", id)
    try {
      const { error: viewError } = await supabase.rpc("increment_video_views", { video_id: id })
      if (viewError) {
        console.error("Error incrementing views:", viewError)
      } else {
        console.log("View count incremented successfully")
      }
    } catch (error) {
      console.error("Error calling increment_video_views:", error)
    }
  } else {
    console.log("Not incrementing view count - user is the owner")
  }

  // Fetch related videos
  const { data: relatedVideos } = await supabase
    .from("videos")
    .select(`
      id,
      title,
      thumbnail_url,
      duration,
      views,
      created_at,
      profiles!inner (
        username,
        avatar_url
      )
    `)
    .eq("is_public", true)
    .neq("id", id)
    .limit(10)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer video={video} />

            {/* Video Information */}
            <VideoInfo video={video} currentUser={user} />

            {/* Comments Section */}
            <VideoComments videoId={id} />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <RelatedVideos videos={relatedVideos || []} />
          </div>
        </div>
      </main>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: WatchPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: video } = await supabase
    .from("videos")
    .select("title, description, thumbnail_url")
    .eq("id", id)
    .single()

  if (!video) {
    return {
      title: "Video Not Found - VideoMe",
    }
  }

  return {
    title: `${video.title} - VideoMe`,
    description: video.description || `Watch ${video.title} on VideoMe`,
    openGraph: {
      title: video.title,
      description: video.description || `Watch ${video.title} on VideoMe`,
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
    },
  }
}
