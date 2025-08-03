"use client"

import { useEffect, useState } from "react"
import { VideoCard } from "./video-card"
import { UserCard } from "./user-card"
import { Loader2 } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  thumbnail_url: string
  duration: number
  view_count: number
  like_count: number
  created_at: string
  user_id: string
  profiles: {
    username: string
    avatar_url: string
  }
}

interface User {
  id: string
  username: string
  avatar_url: string
  subscriber_count: number
  video_count: number
}

interface SearchResultsProps {
  query: string
  filter: string
  sortBy: string
}

export function SearchResults({ query, filter, sortBy }: SearchResultsProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Check session storage for current user
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = sessionStorage.getItem("videome_user")
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (query.trim()) {
      searchContent()
    } else {
      setVideos([])
      setUsers([])
    }
  }, [query, filter, sortBy])

  const searchContent = async () => {
    setLoading(true)
    try {
      // Simulate API call with dummy data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate dummy search results based on query
      const dummyVideos: Video[] = [
        {
          id: "1",
          title: `${query} - Amazing Tutorial`,
          description: `Learn everything about ${query} in this comprehensive tutorial`,
          thumbnail_url: `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(query + " tutorial")}`,
          duration: 600,
          view_count: 15420,
          like_count: 892,
          created_at: "2024-01-15T10:00:00Z",
          user_id: "user1",
          profiles: {
            username: "TechGuru",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
        },
        {
          id: "2",
          title: `Best ${query} Tips and Tricks`,
          description: `Discover the best tips and tricks for ${query}`,
          thumbnail_url: `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(query + " tips")}`,
          duration: 420,
          view_count: 8930,
          like_count: 567,
          created_at: "2024-01-10T14:30:00Z",
          user_id: "user2",
          profiles: {
            username: "ProTips",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
        },
        {
          id: "3",
          title: `${query} for Beginners`,
          description: `A beginner-friendly guide to ${query}`,
          thumbnail_url: `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(query + " beginners")}`,
          duration: 780,
          view_count: 23450,
          like_count: 1234,
          created_at: "2024-01-08T09:15:00Z",
          user_id: "user3",
          profiles: {
            username: "LearnEasy",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
        },
      ]

      const dummyUsers: User[] = [
        {
          id: "user1",
          username: `${query}Master`,
          avatar_url: `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(query + " master")}`,
          subscriber_count: 45600,
          video_count: 127,
        },
        {
          id: "user2",
          username: `${query}Expert`,
          avatar_url: `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(query + " expert")}`,
          subscriber_count: 23400,
          video_count: 89,
        },
      ]

      // Apply filters
      let filteredVideos = dummyVideos
      let filteredUsers = dummyUsers

      if (filter === "videos") {
        filteredUsers = []
      } else if (filter === "channels") {
        filteredVideos = []
      }

      // Apply sorting
      if (sortBy === "date") {
        filteredVideos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      } else if (sortBy === "views") {
        filteredVideos.sort((a, b) => b.view_count - a.view_count)
      } else if (sortBy === "rating") {
        filteredVideos.sort((a, b) => b.like_count - a.like_count)
      }

      setVideos(filteredVideos)
      setUsers(filteredUsers)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Start typing to search</div>
        <div className="text-gray-400">Search for videos, channels, and more</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Searching...</span>
      </div>
    )
  }

  const totalResults = videos.length + users.length

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No results found for "{query}"</div>
        <div className="text-gray-400">Try different keywords or check your spelling</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-gray-600">
        About {totalResults} results for "{query}"
      </div>

      {/* Channels Results */}
      {users.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}

      {/* Videos Results */}
      {videos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} currentUser={currentUser} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
