import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { MyVideosGrid } from "@/components/my-videos-grid"
import { Button } from "@/components/ui/button"
import { Upload, Video } from "lucide-react"
import Link from "next/link"

export default async function MyVideosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  console.log("Fetching videos for user:", user.id)

  // Fetch user's videos with all stats
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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user videos:", error)
  }

  console.log("Fetched user videos:", videos?.length || 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Videos</h1>
              <p className="text-muted-foreground">Manage and track your uploaded content</p>
            </div>
            <Button asChild>
              <Link href="/upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Video
              </Link>
            </Button>
          </div>

          {videos && videos.length > 0 ? (
            <MyVideosGrid videos={videos} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center max-w-md">
                <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your content with the VideoMe community by uploading your first video.
                </p>
                <Button asChild size="lg">
                  <Link href="/upload" className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Your First Video
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
