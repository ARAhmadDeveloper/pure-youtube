import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VideoGrid } from "@/components/video-grid"
import { Header } from "@/components/header"
import { AnimatedSidebar } from "@/components/animated-sidebar"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  console.log("Fetching videos for home page...")

  // Fetch videos for the dashboard with all stats
  const { data: videos, error } = await supabase
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
        username,
        avatar_url
      )
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching videos:", error)
  }

  console.log("Fetched videos:", videos?.length || 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AnimatedSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to VideoMe</h1>
              <p className="text-muted-foreground">Discover and share amazing videos from creators around the world</p>
            </div>
            <VideoGrid videos={videos || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
