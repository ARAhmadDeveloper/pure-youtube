import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { SettingsLayout } from "@/components/settings-layout"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user's video count for storage info
  const { data: videos } = await supabase.from("videos").select("id, video_url").eq("user_id", user.id)

  // Fetch subscription data
  const { data: subscriptions } = await supabase.from("subscriptions").select("*").eq("subscriber_id", user.id)

  const { data: subscribers } = await supabase.from("subscriptions").select("*").eq("channel_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SettingsLayout
          user={user}
          profile={profile}
          videoCount={videos?.length || 0}
          subscriptionCount={subscriptions?.length || 0}
          subscriberCount={subscribers?.length || 0}
        />
      </main>
    </div>
  )
}
