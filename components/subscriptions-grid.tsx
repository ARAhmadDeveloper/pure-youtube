"use client"

import { useState } from "react"
import { SubscriptionVideoCard } from "./subscription-video-card"
import { Button } from "@/components/ui/button"
import { Users, Bell } from "lucide-react"

// Dummy data for subscription videos
const dummySubscriptionVideos = [
  {
    id: "1",
    title: "React 19 New Features Deep Dive",
    description: "Exploring all the new features in React 19",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1845,
    views: 25420,
    likes: 1892,
    comment_count: 256,
    created_at: "2024-01-22T10:30:00Z",
    profiles: {
      username: "reactdev",
      avatar_url: "/placeholder.svg?height=40&width=40",
      full_name: "React Developer",
      subscriber_count: 125000,
    },
  },
  {
    id: "2",
    title: "Building Scalable APIs with Node.js",
    description: "Learn how to build APIs that can handle millions of requests",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 2456,
    views: 18934,
    likes: 1267,
    comment_count: 189,
    created_at: "2024-01-21T16:45:00Z",
    profiles: {
      username: "nodeexpert",
      avatar_url: "/placeholder.svg?height=40&width=40",
      full_name: "Node Expert",
      subscriber_count: 89000,
    },
  },
  {
    id: "3",
    title: "CSS Container Queries Explained",
    description: "Master the new CSS container queries feature",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1276,
    views: 12567,
    likes: 834,
    comment_count: 123,
    created_at: "2024-01-20T12:20:00Z",
    profiles: {
      username: "cssguru",
      avatar_url: "/placeholder.svg?height=40&width=40",
      full_name: "CSS Guru",
      subscriber_count: 67000,
    },
  },
  {
    id: "4",
    title: "Database Optimization Techniques",
    description: "Speed up your database queries with these techniques",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 2134,
    views: 16789,
    likes: 945,
    comment_count: 167,
    created_at: "2024-01-19T14:10:00Z",
    profiles: {
      username: "dbarchitect",
      avatar_url: "/placeholder.svg?height=40&width=40",
      full_name: "DB Architect",
      subscriber_count: 54000,
    },
  },
  {
    id: "5",
    title: "JavaScript Performance Tips 2024",
    description: "Latest performance optimization tips for JavaScript",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1654,
    views: 21234,
    likes: 1456,
    comment_count: 234,
    created_at: "2024-01-18T09:30:00Z",
    profiles: {
      username: "jsninjas",
      avatar_url: "/placeholder.svg?height=40&width=40",
      full_name: "JS Ninja",
      subscriber_count: 98000,
    },
  },
  {
    id: "6",
    title: "TypeScript 5.3 What's New",
    description: "Overview of new features in TypeScript 5.3",
    thumbnail_url: "/placeholder.svg?height=180&width=320",
    duration: 1432,
    views: 14567,
    likes: 789,
    comment_count: 134,
    created_at: "2024-01-17T11:15:00Z",
    profiles: {
      username: "tsmaster",
      avatar_url: "/placeholder.svg?height=40&width=40",
      full_name: "TypeScript Master",
      subscriber_count: 76000,
    },
  },
]

export function SubscriptionsGrid() {
  const [videos] = useState(dummySubscriptionVideos)

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No subscriptions yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Subscribe to channels to see their latest videos here</p>
          <Button asChild>
            <a href="/">Discover Channels</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">Get notified when subscribed channels upload new videos</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <SubscriptionVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
