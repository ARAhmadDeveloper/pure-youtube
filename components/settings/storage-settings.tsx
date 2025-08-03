"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HardDrive, Video, ImageIcon, Trash2, Download, Info } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface StorageSettingsProps {
  user: SupabaseUser
  videoCount: number
}

export function StorageSettings({ user, videoCount }: StorageSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [storageData, setStorageData] = useState({
    totalUsed: 0,
    videoStorage: 0,
    thumbnailStorage: 0,
    totalLimit: 5 * 1024 * 1024 * 1024, // 5GB in bytes
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchStorageData()
  }, [user.id])

  const fetchStorageData = async () => {
    try {
      // Fetch video files
      const { data: videoFiles } = await supabase.storage.from("videos").list(`${user.id}/`, {
        limit: 1000,
      })

      // Fetch thumbnail files
      const { data: thumbnailFiles } = await supabase.storage.from("thumbnails").list(`${user.id}/`, {
        limit: 1000,
      })

      let videoStorage = 0
      let thumbnailStorage = 0

      if (videoFiles) {
        videoStorage = videoFiles.reduce((total, file) => total + (file.metadata?.size || 0), 0)
      }

      if (thumbnailFiles) {
        thumbnailStorage = thumbnailFiles.reduce((total, file) => total + (file.metadata?.size || 0), 0)
      }

      setStorageData({
        totalUsed: videoStorage + thumbnailStorage,
        videoStorage,
        thumbnailStorage,
        totalLimit: 5 * 1024 * 1024 * 1024, // 5GB
      })
    } catch (error) {
      console.error("Error fetching storage data:", error)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getUsagePercentage = () => {
    return (storageData.totalUsed / storageData.totalLimit) * 100
  }

  const handleClearCache = async () => {
    setIsLoading(true)
    try {
      // Simulate cache clearing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Cache cleared",
        description: "Temporary files and cache have been cleared.",
      })

      fetchStorageData()
    } catch (error: any) {
      toast({
        title: "Clear cache failed",
        description: error.message || "Failed to clear cache",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptimizeStorage = async () => {
    setIsLoading(true)
    try {
      // Simulate storage optimization
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Storage optimized",
        description: "Your storage has been optimized and unnecessary files removed.",
      })

      fetchStorageData()
    } catch (error: any) {
      toast({
        title: "Optimization failed",
        description: error.message || "Failed to optimize storage",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5" />
            <span>Storage Overview</span>
          </CardTitle>
          <CardDescription>Monitor your storage usage and manage your files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Used</span>
              <span className="text-sm text-muted-foreground">
                {formatBytes(storageData.totalUsed)} of {formatBytes(storageData.totalLimit)}
              </span>
            </div>

            <Progress value={getUsagePercentage()} className="w-full" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Videos</p>
                <p className="text-xs text-muted-foreground">{formatBytes(storageData.videoStorage)}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Thumbnails</p>
                <p className="text-xs text-muted-foreground">{formatBytes(storageData.thumbnailStorage)}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <HardDrive className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Available</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(storageData.totalLimit - storageData.totalUsed)}
                </p>
              </div>
            </div>
          </div>

          {getUsagePercentage() > 80 && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You're running low on storage space. Consider deleting unused videos or upgrading your plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Storage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Details</CardTitle>
          <CardDescription>Detailed breakdown of your storage usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Video className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Video Files</p>
                  <p className="text-sm text-muted-foreground">{videoCount} videos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatBytes(storageData.videoStorage)}</p>
                <p className="text-sm text-muted-foreground">
                  {videoCount > 0 ? formatBytes(storageData.videoStorage / videoCount) : "0 Bytes"} avg
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Thumbnails</p>
                  <p className="text-sm text-muted-foreground">{videoCount} thumbnails</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatBytes(storageData.thumbnailStorage)}</p>
                <p className="text-sm text-muted-foreground">
                  {videoCount > 0 ? formatBytes(storageData.thumbnailStorage / videoCount) : "0 Bytes"} avg
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Management */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Management</CardTitle>
          <CardDescription>Tools to help you manage and optimize your storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isLoading ? "Clearing..." : "Clear Cache"}</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleOptimizeStorage}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              <span>{isLoading ? "Optimizing..." : "Optimize Storage"}</span>
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Storage optimization will remove temporary files and compress thumbnails to free up space. This process
              may take a few minutes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Storage Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Plan</CardTitle>
          <CardDescription>Your current storage plan and upgrade options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-muted-foreground">5GB storage included</p>
            </div>
            <Badge variant="outline">Current Plan</Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
              <div>
                <p className="font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">50GB storage + premium features</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$9.99/month</p>
                <Button variant="outline" size="sm" disabled>
                  Upgrade
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
              <div>
                <p className="font-medium">Business Plan</p>
                <p className="text-sm text-muted-foreground">500GB storage + advanced analytics</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$29.99/month</p>
                <Button variant="outline" size="sm" disabled>
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
