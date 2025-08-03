"use client"

import { useState } from "react"
import { WatchLaterVideoCard } from "./watch-later-video-card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

// Dummy data for watch later videos
const dummyWatchLaterVideos = [
  {
    id: "1",
    title: "How to Build a React App from Scratch",
    description: "Learn the fundamentals of React development",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1245,
    views: 15420,
    likes: 892,
    comment_count: 156,
    created_at: "2024-01-15T10:30:00Z",
    added_at: "2024-01-20T14:22:00Z",
    profiles: {
      username: "reactdev",
      avatar_url: "/placeholder.svg?height=32&width=32",
      full_name: "React Developer",
    },
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    description: "Master advanced TypeScript concepts and patterns",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 2156,
    views: 8934,
    likes: 567,
    comment_count: 89,
    created_at: "2024-01-12T16:45:00Z",
    added_at: "2024-01-19T09:15:00Z",
    profiles: {
      username: "tsmaster",
      avatar_url: "/placeholder.svg?height=32&width=32",
      full_name: "TypeScript Master",
    },
  },
  {
    id: "3",
    title: "CSS Grid Layout Complete Guide",
    description: "Everything you need to know about CSS Grid",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1876,
    views: 12567,
    likes: 734,
    comment_count: 123,
    created_at: "2024-01-10T12:20:00Z",
    added_at: "2024-01-18T11:30:00Z",
    profiles: {
      username: "cssguru",
      avatar_url: "/placeholder.svg?height=32&width=32",
      full_name: "CSS Guru",
    },
  },
  {
    id: "4",
    title: "Node.js Performance Optimization",
    description: "Boost your Node.js application performance",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1654,
    views: 6789,
    likes: 445,
    comment_count: 67,
    created_at: "2024-01-08T14:10:00Z",
    added_at: "2024-01-17T16:45:00Z",
    profiles: {
      username: "nodeexpert",
      avatar_url: "/placeholder.svg?height=32&width=32",
      full_name: "Node Expert",
    },
  },
  {
    id: "5",
    title: "Database Design Best Practices",
    description: "Learn how to design efficient databases",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 2234,
    views: 9876,
    likes: 623,
    comment_count: 98,
    created_at: "2024-01-05T09:30:00Z",
    added_at: "2024-01-16T13:20:00Z",
    profiles: {
      username: "dbarchitect",
      avatar_url: "/placeholder.svg?height=32&width=32",
      full_name: "DB Architect",
    },
  },
  {
    id: "6",
    title: "Modern JavaScript ES2024 Features",
    description: "Explore the latest JavaScript features",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1432,
    views: 11234,
    likes: 789,
    comment_count: 134,
    created_at: "2024-01-03T11:15:00Z",
    added_at: "2024-01-15T10:10:00Z",
    profiles: {
      username: "jsninjas",
      avatar_url: "/placeholder.svg?height=32&width=32",
      full_name: "JS Ninja",
    },
  },
]

export function WatchLaterGrid() {
  const [videos, setVideos] = useState(dummyWatchLaterVideos)

  const handleRemoveVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== videoId))
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No videos saved yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start adding videos to your watch later list to see them here
          </p>
          <Button asChild>
            <a href="/">Browse Videos</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <WatchLaterVideoCard key={video.id} video={video} onRemove={handleRemoveVideo} />
      ))}
    </div>
  )
}
