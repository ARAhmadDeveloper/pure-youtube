"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Globe, Video, Eye, ThumbsUp, MessageCircle, Users, UserPlus, UserMinus, Play } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface PublicUserProfileProps {
  profile: {
    id: string
    username: string
    full_name: string
    avatar_url: string
    bio: string
    website: string
    created_at: string
  }
  videos: Array<{
    id: string
    title: string
    description: string
    thumbnail_url: string
    duration: number
    views: number
    likes: number
    comment_count: number
    created_at: string
  }>
  stats: {
    totalVideos: number
    totalViews: number
    totalLikes: number
    subscribersCount: number
  }
  currentUser: SupabaseUser | null
  isSubscribed: boolean
}

export function PublicUserProfile({
  profile,
  videos,
  stats,
  currentUser,
  isSubscribed: initialIsSubscribed,
}: PublicUserProfileProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed)
  const [subscribersCount, setSubscribersCount] = useState(stats.subscribersCount)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleSubscribe = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to channels",
        variant: "destructive",
      })
      return
    }

    if (currentUser.id === profile.id) {
      toast({
        title: "Cannot subscribe",
        description: "You cannot subscribe to your own channel",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("subscriber_id", currentUser.id)
          .eq("channel_id", profile.id)

        if (!error) {
          setIsSubscribed(false)
          setSubscribersCount((prev) => Math.max(0, prev - 1))
          toast({
            title: "Unsubscribed",
            description: `You unsubscribed from ${profile.username}`,
          })
        }
      } else {
        // Subscribe
        const { error } = await supabase.from("subscriptions").insert({
          subscriber_id: currentUser.id,
          channel_id: profile.id,
        })

        if (!error) {
          setIsSubscribed(true)
          setSubscribersCount((prev) => prev + 1)
          toast({
            title: "Subscribed",
            description: `You subscribed to ${profile.username}`,
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || profile.username} />
              <AvatarFallback className="text-2xl">
                {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>

              {profile.bio && <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profile.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{formatCount(subscribersCount)} subscribers</span>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            {currentUser && currentUser.id !== profile.id && (
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                variant={isSubscribed ? "outline" : "default"}
                className="flex items-center space-x-2"
              >
                {isSubscribed ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    <span>Unsubscribe</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Subscribe</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCount(stats.totalVideos)}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{formatCount(stats.totalViews)}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{formatCount(stats.totalLikes)}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{formatCount(subscribersCount)}</p>
                <p className="text-xs text-muted-foreground">Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Section */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList>
          <TabsTrigger value="videos">Videos ({stats.totalVideos})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
                  <Link href={`/watch/${video.id}`}>
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <Image
                          src={video.thumbnail_url || "/placeholder.svg?height=180&width=320&query=video thumbnail"}
                          alt={video.title}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />

                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-black/70 rounded-full p-3">
                              <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                        </div>

                        {/* Duration badge */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors mb-2">
                          {video.title}
                        </h3>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{formatCount(video.views)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{formatCount(video.likes)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{formatCount(video.comment_count)}</span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground">This channel hasn't uploaded any public videos.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About {profile.full_name || profile.username}</h3>
                  {profile.bio ? (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No description available.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium mb-2">Channel Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Videos:</span>
                        <span>{stats.totalVideos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Views:</span>
                        <span>{formatCount(stats.totalViews)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Likes:</span>
                        <span>{formatCount(stats.totalLikes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscribers:</span>
                        <span>{formatCount(subscribersCount)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Channel Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined:</span>
                        <span>{formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                      </div>
                      {profile.website && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Website:</span>
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
