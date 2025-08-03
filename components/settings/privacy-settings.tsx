"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, Users, Globe, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface PrivacySettingsProps {
  user: SupabaseUser
  profile: any
}

export function PrivacySettings({ user, profile }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    profile_visibility: true,
    show_subscriber_count: true,
    show_video_count: true,
    allow_comments: true,
    allow_video_downloads: true,
    show_liked_videos: false,
    show_subscriptions: false,
    allow_direct_messages: true,
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    // Load existing privacy settings if they exist
    // For now, we'll use default values
    // In a real app, you'd fetch these from a privacy_settings table
  }, [user.id])

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // In a real app, you'd save these to a privacy_settings table
      // For now, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update privacy settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Profile Privacy</span>
          </CardTitle>
          <CardDescription>Control who can see your profile and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile_visibility">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow others to view your profile page</p>
            </div>
            <Switch
              id="profile_visibility"
              checked={settings.profile_visibility}
              onCheckedChange={(checked) => handleSettingChange("profile_visibility", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show_subscriber_count">Show Subscriber Count</Label>
              <p className="text-sm text-muted-foreground">Display your subscriber count publicly</p>
            </div>
            <Switch
              id="show_subscriber_count"
              checked={settings.show_subscriber_count}
              onCheckedChange={(checked) => handleSettingChange("show_subscriber_count", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show_video_count">Show Video Count</Label>
              <p className="text-sm text-muted-foreground">Display your total video count publicly</p>
            </div>
            <Switch
              id="show_video_count"
              checked={settings.show_video_count}
              onCheckedChange={(checked) => handleSettingChange("show_video_count", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show_liked_videos">Show Liked Videos</Label>
              <p className="text-sm text-muted-foreground">Allow others to see videos you've liked</p>
            </div>
            <Switch
              id="show_liked_videos"
              checked={settings.show_liked_videos}
              onCheckedChange={(checked) => handleSettingChange("show_liked_videos", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show_subscriptions">Show Subscriptions</Label>
              <p className="text-sm text-muted-foreground">Allow others to see channels you subscribe to</p>
            </div>
            <Switch
              id="show_subscriptions"
              checked={settings.show_subscriptions}
              onCheckedChange={(checked) => handleSettingChange("show_subscriptions", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Video Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Video Privacy</span>
          </CardTitle>
          <CardDescription>Control how others can interact with your videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow_comments">Allow Comments</Label>
              <p className="text-sm text-muted-foreground">Let viewers comment on your videos</p>
            </div>
            <Switch
              id="allow_comments"
              checked={settings.allow_comments}
              onCheckedChange={(checked) => handleSettingChange("allow_comments", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow_video_downloads">Allow Video Downloads</Label>
              <p className="text-sm text-muted-foreground">Let viewers download your videos</p>
            </div>
            <Switch
              id="allow_video_downloads"
              checked={settings.allow_video_downloads}
              onCheckedChange={(checked) => handleSettingChange("allow_video_downloads", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Communication</span>
          </CardTitle>
          <CardDescription>Control how others can contact you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow_direct_messages">Allow Direct Messages</Label>
              <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
            </div>
            <Switch
              id="allow_direct_messages"
              checked={settings.allow_direct_messages}
              onCheckedChange={(checked) => handleSettingChange("allow_direct_messages", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </div>
    </div>
  )
}
