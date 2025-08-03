import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Fetch user profile data
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
  }

  // Fetch user's video statistics
  const { data: videoStats } = await supabase
    .from("videos")
    .select("id, views, likes, comment_count, is_public")
    .eq("user_id", user.id)

  // Calculate statistics
  const totalVideos = videoStats?.length || 0
  const publicVideos = videoStats?.filter((v) => v.is_public).length || 0
  const privateVideos = totalVideos - publicVideos
  const totalViews = videoStats?.reduce((sum, video) => sum + (video.views || 0), 0) || 0
  const totalLikes = videoStats?.reduce((sum, video) => sum + (video.likes || 0), 0) || 0
  const totalComments = videoStats?.reduce((sum, video) => sum + (video.comment_count || 0), 0) || 0

  // Fetch subscription counts
  const { data: subscribersData } = await supabase.from("subscriptions").select("id").eq("channel_id", user.id)

  const { data: subscribingData } = await supabase.from("subscriptions").select("id").eq("subscriber_id", user.id)

  const subscribersCount = subscribersData?.length || 0
  const subscribingCount = subscribingData?.length || 0

  const stats = {
    totalVideos,
    publicVideos,
    privateVideos,
    totalViews,
    totalLikes,
    totalComments,
    subscribersCount,
    subscribingCount,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UserProfile user={user} profile={profile} stats={stats} />
      </main>
    </div>
  )
}
