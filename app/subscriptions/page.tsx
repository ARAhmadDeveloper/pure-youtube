import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { AnimatedSidebar } from "@/components/animated-sidebar"
import { SubscriptionsGrid } from "@/components/subscriptions-grid"

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Subscriptions</h1>
              <p className="text-muted-foreground">Latest videos from channels you're subscribed to</p>
            </div>
            <SubscriptionsGrid />
          </div>
        </main>
      </div>
    </div>
  )
}
