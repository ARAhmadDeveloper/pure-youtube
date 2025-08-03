"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, TrendingUp, Eye, Heart, MessageCircle, Calendar } from "lucide-react"

interface TrendingFiltersProps {
  currentTimeframe: string
  currentSort: string
}

export function TrendingFilters({ currentTimeframe, currentSort }: TrendingFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const timeframes = [
    { value: "1h", label: "Last Hour", icon: Clock },
    { value: "6h", label: "Last 6 Hours", icon: Clock },
    { value: "24h", label: "Last 24 Hours", icon: Clock },
    { value: "7d", label: "Last Week", icon: Calendar },
    { value: "30d", label: "Last Month", icon: Calendar },
  ]

  const sortOptions = [
    { value: "trending", label: "Trending Score", icon: TrendingUp },
    { value: "views", label: "Most Viewed", icon: Eye },
    { value: "likes", label: "Most Liked", icon: Heart },
    { value: "comments", label: "Most Commented", icon: MessageCircle },
    { value: "recent", label: "Most Recent", icon: Calendar },
  ]

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/trending?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Timeframe Filter */}
      <div className="flex flex-wrap gap-2">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe.value}
            variant={currentTimeframe === timeframe.value ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter("timeframe", timeframe.value)}
            className="flex items-center space-x-2"
          >
            <timeframe.icon className="w-4 h-4" />
            <span>{timeframe.label}</span>
          </Button>
        ))}
      </div>

      {/* Sort Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={currentSort} onValueChange={(value) => updateFilter("sort", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <option.icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
