"use client"

import { useAuth } from "@/components/auth-provider"
import { VideoGrid } from "@/components/video-grid"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SetupGuide } from "@/components/setup-guide"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Video {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  views: number
  likes: number
  comment_count: number
  created_at: string
  user_id: string
  profiles: {
    id: string
    username: string
    avatar_url: string
  }
}

export default function HomePage() {
  const { user, loading, error } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const router = useRouter()

  // Check authentication first
  useEffect(() => {
    if (!loading && !user && !error) {
      router.push("/auth/signin")
    }
  }, [user, loading, error, router])

  useEffect(() => {
    if (user) {
      fetchVideos()
    }
  }, [user])

  const fetchVideos = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
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
            id,
            username,
            avatar_url
          )
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching videos:", error)
      } else {
        setVideos(data || [])
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setVideosLoading(false)
    }
  }

  // Show setup guide if there's a configuration error
  if (error) {
    return <SetupGuide />
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to signin if not authenticated (handled by useEffect above)
  if (!user) {
    return null
  }

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-16 h-full z-40 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={handleSidebarToggle} />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to VideoMe</h1>
              <p className="text-gray-600">Discover and share amazing videos from creators around the world.</p>
            </div>

            {videosLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <VideoGrid videos={videos} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
