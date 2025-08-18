import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"
import { VideoInfo } from "@/components/video-info"
import { VideoComments } from "@/components/video-comments"
import { RelatedVideos } from "@/components/related-videos"
import { Header } from "@/components/header"

interface WatchPageProps {
  params: Promise<{ id: string }>
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      redirect("/auth/signin")
    }

    console.log("Fetching video with ID:", id)

    // Fetch video data with profile information
    const { data: video, error: videoError } = await supabase
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
        created_at,
        user_id,
        profiles!inner (
          id,
          username,
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq("id", id)
      .single()

    if (videoError) {
      console.error("Error fetching video:", videoError)
      if (videoError.code === "PGRST116") {
        notFound()
      }
      throw new Error("Failed to fetch video")
    }

    if (!video) {
      console.log("Video not found")
      notFound()
    }

    // Check if video is public or if user owns the video
    if (!video.is_public && video.user_id !== user.id) {
      console.log("Video is private and user doesn't own it")
      notFound()
    }

    console.log("Video fetched successfully:", video.title)

    // Increment view count (only if not the owner)
    if (video.user_id !== user.id) {
      try {
        await supabase.rpc("increment_video_views", { video_id: id })
        console.log("View count incremented")
      } catch (error) {
        console.error("Error incrementing view count:", error)
      }
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
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer video={video} />
              <VideoInfo video={video} />
              <VideoComments videoId={video.id} />
            </div>
            <div className="lg:col-span-1">
              <RelatedVideos videos={relatedVideos || []} />
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error in watch page:", error)
    redirect("/auth/signin")
  }
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
