import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { AnimatedSidebar } from "@/components/animated-sidebar"
import { LikedVideosGrid } from "@/components/liked-videos-grid"

export default async function LikedPage() {
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

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <AnimatedSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Liked Videos</h1>
                <p className="text-muted-foreground">Videos you've liked</p>
              </div>
              <LikedVideosGrid userId={user.id} />
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in liked page:", error)
    redirect("/auth/signin")
  }
}
