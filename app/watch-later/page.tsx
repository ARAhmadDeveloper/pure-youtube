import { WatchLaterGrid } from "@/components/watch-later-grid"
import { Clock } from "lucide-react"

export default function WatchLaterPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Watch Later</h1>
      </div>

      <WatchLaterGrid />
    </div>
  )
}
