"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Video } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  username: string
  avatar_url: string
  subscriber_count: number
  video_count: number
}

interface UserCardProps {
  user: User
  currentUser: any
}

export function UserCard({ user, currentUser }: UserCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(user.subscriber_count)

  const handleSubscribe = async () => {
    if (!currentUser) {
      // Redirect to login or show login modal
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsSubscribed(!isSubscribed)
      setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1))
    } catch (error) {
      console.error("Subscribe error:", error)
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={`/profile/${user.username}`} className="hover:text-blue-600">
              <h3 className="font-semibold text-lg truncate">{user.username}</h3>
            </Link>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {formatCount(subscriberCount)} subscribers
              </div>
              <div className="flex items-center">
                <Video className="h-4 w-4 mr-1" />
                {user.video_count} videos
              </div>
            </div>

            {currentUser && currentUser.id !== user.id && (
              <Button
                onClick={handleSubscribe}
                variant={isSubscribed ? "outline" : "default"}
                size="sm"
                className="mt-3"
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
