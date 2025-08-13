import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LikedVideosGrid } from "@/components/liked-videos-grid"

export default async function LikedPage() {
  try {
    const supabase = await createClient()

    if (!supabase || !supabase.auth) {
      console.error("Supabase client not initialized properly")
      redirect("/auth/signin")
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Auth error:", authError)
      redirect("/auth/signin")
    }

    if (!user) {
      console.log("No user found, redirecting to signin")
      redirect("/auth/signin")
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Liked Videos</h1>
          <p className="text-muted-foreground">Videos you've liked</p>
        </div>
        <LikedVideosGrid userId={user.id} />
      </div>
    )
  } catch (error) {
    console.error("Error in liked page:", error)
    redirect("/auth/signin")
  }
}
