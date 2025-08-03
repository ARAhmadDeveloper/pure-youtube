"use client"

import { TrendingVideoCard } from "./trending-video-card"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TrendingVideo {
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
  username: string
  avatar_url: string
  trending_score: number
  hours_since_upload: number
}

interface TrendingGridProps {
  videos: TrendingVideo[]
}

export function TrendingGrid({ videos }: TrendingGridProps) {
  if (!videos.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No trending videos found</h3>
          <p className="text-sm text-muted-foreground text-center">
            Try adjusting your filters or check back later for trending content.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Featured */}
      {videos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span>Top Trending</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((video, index) => (
              <TrendingVideoCard key={video.id} video={video} rank={index + 1} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Rest of the videos */}
      {videos.length > 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">More Trending Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.slice(3).map((video, index) => (
              <TrendingVideoCard key={video.id} video={video} rank={index + 4} featured={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
