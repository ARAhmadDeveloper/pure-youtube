"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Upload, Video, X, Play, Pause, Volume2, VolumeX, Edit3, Save, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface VideoMetadata {
  title: string
  description: string
  tags: string[]
  isPublic: boolean
  thumbnail?: File
}

export function VideoUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: "",
    description: "",
    tags: [],
    isPublic: true,
  })
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find((file) => file.type.startsWith("video/"))

    if (videoFile) {
      handleFileSelect(videoFile)
    }
  }, [])

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file")
      return
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      setError("File size must be less than 100MB")
      return
    }

    setSelectedFile(file)
    setError("")

    // Create video URL for preview
    const url = URL.createObjectURL(file)
    setVideoUrl(url)

    // Auto-generate title from filename
    const fileName = file.name.replace(/\.[^/.]+$/, "")
    setMetadata((prev) => ({
      ...prev,
      title: prev.title || fileName,
    }))

    // Generate thumbnail
    generateThumbnail(url)
  }

  const generateThumbnail = (videoUrl: string) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    video.addEventListener("loadedmetadata", () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      setDuration(Math.floor(video.duration))
    })

    video.addEventListener("seeked", () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailUrl = URL.createObjectURL(blob)
              setThumbnailUrl(thumbnailUrl)
            }
          },
          "image/jpeg",
          0.8,
        )
      }
    })

    video.src = videoUrl
    video.currentTime = 1 // Capture frame at 1 second
  }

  const handleInputChange = (field: keyof VideoMetadata, value: any) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const uploadVideo = async () => {
    if (!selectedFile || !metadata.title.trim()) {
      setError("Please select a video file and provide a title")
      return
    }

    setIsUploading(true)
    setError("")
    console.log("Starting video upload...")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      console.log("User authenticated:", user.id)

      // Generate unique filename
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      console.log("Uploading video with filename:", fileName)

      // Upload video file
      const { data: videoData, error: videoError } = await supabase.storage
        .from("videos")
        .upload(fileName, selectedFile, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100
            setUploadProgress(percentage)
            console.log("Upload progress:", percentage + "%")
          },
        })

      if (videoError) {
        console.error("Video upload error:", videoError)
        throw videoError
      }

      console.log("Video uploaded successfully:", videoData)

      // Get public URL for video
      const {
        data: { publicUrl: videoPublicUrl },
      } = supabase.storage.from("videos").getPublicUrl(videoData.path)

      console.log("Video public URL:", videoPublicUrl)

      // Upload thumbnail if available
      let thumbnailPublicUrl = ""
      if (thumbnailUrl) {
        try {
          const thumbnailBlob = await fetch(thumbnailUrl).then((r) => r.blob())
          const thumbnailFileName = `${user.id}/thumbnails/${Date.now()}.jpg`

          const { data: thumbnailData, error: thumbnailError } = await supabase.storage
            .from("thumbnails")
            .upload(thumbnailFileName, thumbnailBlob)

          if (!thumbnailError && thumbnailData) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("thumbnails").getPublicUrl(thumbnailData.path)
            thumbnailPublicUrl = publicUrl
            console.log("Thumbnail uploaded:", thumbnailPublicUrl)
          }
        } catch (thumbError) {
          console.warn("Thumbnail upload failed:", thumbError)
          // Continue without thumbnail
        }
      }

      // Prepare video data for database
      const videoRecord = {
        user_id: user.id,
        title: metadata.title.trim(),
        description: metadata.description.trim() || null,
        video_url: videoPublicUrl,
        thumbnail_url: thumbnailPublicUrl || null,
        duration: duration,
        tags: metadata.tags.length > 0 ? metadata.tags : null,
        is_public: metadata.isPublic,
        views: 0,
        likes: 0,
      }

      console.log("Inserting video record:", videoRecord)

      // Save video metadata to database
      const { data: insertedVideo, error: dbError } = await supabase
        .from("videos")
        .insert(videoRecord)
        .select()
        .single()

      if (dbError) {
        console.error("Database insert error:", dbError)
        throw dbError
      }

      console.log("Video record inserted successfully:", insertedVideo)

      toast({
        title: "Video uploaded successfully!",
        description: "Your video is now available on VideoMe.",
      })

      // Reset form and redirect
      resetForm()
      router.push("/my-videos")
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload video")
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload video",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setVideoUrl("")
    setThumbnailUrl("")
    setMetadata({
      title: "",
      description: "",
      tags: [],
      isPublic: true,
    })
    setError("")
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Select Video File
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Drag and drop your video here</h3>
              <p className="text-muted-foreground mb-4">or click to browse files</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
              <p className="text-xs text-muted-foreground mt-4">Supported formats: MP4, MOV, AVI, WMV (Max: 100MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-64 object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleVideoPlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleVideoMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>

                    <div className="flex-1" />

                    <span className="text-white text-sm">
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Metadata Form */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter video title"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">{metadata.title.length}/100 characters</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Tell viewers about your video"
                rows={4}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground">{metadata.description.length}/5000 characters</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>

              {metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Tags help people discover your video</p>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="visibility">Make video public</Label>
                <p className="text-sm text-muted-foreground">Public videos can be discovered by anyone</p>
              </div>
              <Switch
                id="visibility"
                checked={metadata.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Upload Progress</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={uploadVideo} disabled={isUploading || !metadata.title.trim()} className="flex-1">
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Upload Video
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={resetForm} disabled={isUploading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
