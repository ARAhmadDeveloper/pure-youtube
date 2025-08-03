import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LikedVideosGrid } from "@/components/liked-videos-grid"

export default async function LikedVideosPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Liked Videos</h1>
          <p className="text-muted-foreground">Videos you've liked will appear here</p>
        </div>

        <LikedVideosGrid userId={user.id} />
      </div>
    </div>
  )
}
