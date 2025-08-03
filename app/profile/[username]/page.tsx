import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { PublicUserProfile } from "@/components/public-user-profile"

interface PublicProfilePageProps {
  params: {
    username: string
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Get current user (for checking if this is their own profile)
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  // Fetch profile by username
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (error || !profile) {
    notFound()
  }

  // Fetch user's public videos
  const { data: videos } = await supabase
    .from("videos")
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      duration,
      views,
      likes,
      comment_count,
      created_at
    `)
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  // Calculate statistics
  const totalVideos = videos?.length || 0
  const totalViews = videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0
  const totalLikes = videos?.reduce((sum, video) => sum + (video.likes || 0), 0) || 0

  // Fetch subscription counts
  const { data: subscribersData } = await supabase.from("subscriptions").select("id").eq("channel_id", profile.id)

  const subscribersCount = subscribersData?.length || 0

  // Check if current user is subscribed (if logged in)
  let isSubscribed = false
  if (currentUser && currentUser.id !== profile.id) {
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("subscriber_id", currentUser.id)
      .eq("channel_id", profile.id)
      .single()

    isSubscribed = !!subData
  }

  const stats = {
    totalVideos,
    totalViews,
    totalLikes,
    subscribersCount,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PublicUserProfile
          profile={profile}
          videos={videos || []}
          stats={stats}
          currentUser={currentUser}
          isSubscribed={isSubscribed}
        />
      </main>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PublicProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio, avatar_url")
    .eq("username", username)
    .single()

  if (!profile) {
    return {
      title: "Profile Not Found - VideoMe",
    }
  }

  return {
    title: `${profile.full_name || profile.username} - VideoMe`,
    description: profile.bio || `Check out ${profile.full_name || profile.username}'s videos on VideoMe`,
    openGraph: {
      title: profile.full_name || profile.username,
      description: profile.bio || `Check out ${profile.full_name || profile.username}'s videos on VideoMe`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}
