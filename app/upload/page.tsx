import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VideoUploadForm } from "@/components/video-upload-form"
import { Header } from "@/components/header"

export default async function UploadPage() {
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Video</h1>
            <p className="text-muted-foreground">Share your content with the VideoMe community</p>
          </div>
          <VideoUploadForm />
        </div>
      </main>
    </div>
  )
}
