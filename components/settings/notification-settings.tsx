"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Smartphone, Monitor, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface NotificationSettingsProps {
  user: SupabaseUser
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // Email Notifications
    email_new_subscriber: true,
    email_new_comment: true,
    email_new_like: false,
    email_video_processed: true,
    email_weekly_summary: true,
    email_marketing: false,

    // Push Notifications
    push_new_subscriber: true,
    push_new_comment: true,
    push_new_like: false,
    push_video_processed: true,
    push_live_streams: true,

    // In-App Notifications
    app_new_subscriber: true,
    app_new_comment: true,
    app_new_like: true,
    app_video_processed: true,

    // Frequency Settings
    email_frequency: "immediate",
    push_frequency: "immediate",
    quiet_hours_enabled: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
  })
  const { toast } = useToast()

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Notifications</span>
          </CardTitle>
          <CardDescription>Choose what email notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_new_subscriber">New Subscribers</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone subscribes to your channel</p>
            </div>
            <Switch
              id="email_new_subscriber"
              checked={settings.email_new_subscriber}
              onCheckedChange={(checked) => handleSettingChange("email_new_subscriber", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_new_comment">New Comments</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone comments on your videos</p>
            </div>
            <Switch
              id="email_new_comment"
              checked={settings.email_new_comment}
              onCheckedChange={(checked) => handleSettingChange("email_new_comment", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_new_like">New Likes</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone likes your videos</p>
            </div>
            <Switch
              id="email_new_like"
              checked={settings.email_new_like}
              onCheckedChange={(checked) => handleSettingChange("email_new_like", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_video_processed">Video Processing</Label>
              <p className="text-sm text-muted-foreground">Get notified when your video upload is complete</p>
            </div>
            <Switch
              id="email_video_processed"
              checked={settings.email_video_processed}
              onCheckedChange={(checked) => handleSettingChange("email_video_processed", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_weekly_summary">Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">Get a weekly summary of your channel performance</p>
            </div>
            <Switch
              id="email_weekly_summary"
              checked={settings.email_weekly_summary}
              onCheckedChange={(checked) => handleSettingChange("email_weekly_summary", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_marketing">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
            </div>
            <Switch
              id="email_marketing"
              checked={settings.email_marketing}
              onCheckedChange={(checked) => handleSettingChange("email_marketing", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="email_frequency">Email Frequency</Label>
            <Select
              value={settings.email_frequency}
              onValueChange={(value) => handleSettingChange("email_frequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>Push Notifications</span>
          </CardTitle>
          <CardDescription>Manage push notifications for mobile and desktop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_new_subscriber">New Subscribers</Label>
              <p className="text-sm text-muted-foreground">Push notification for new subscribers</p>
            </div>
            <Switch
              id="push_new_subscriber"
              checked={settings.push_new_subscriber}
              onCheckedChange={(checked) => handleSettingChange("push_new_subscriber", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_new_comment">New Comments</Label>
              <p className="text-sm text-muted-foreground">Push notification for new comments</p>
            </div>
            <Switch
              id="push_new_comment"
              checked={settings.push_new_comment}
              onCheckedChange={(checked) => handleSettingChange("push_new_comment", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_video_processed">Video Processing</Label>
              <p className="text-sm text-muted-foreground">Push notification when video processing is complete</p>
            </div>
            <Switch
              id="push_video_processed"
              checked={settings.push_video_processed}
              onCheckedChange={(checked) => handleSettingChange("push_video_processed", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_live_streams">Live Streams</Label>
              <p className="text-sm text-muted-foreground">Get notified when subscribed channels go live</p>
            </div>
            <Switch
              id="push_live_streams"
              checked={settings.push_live_streams}
              onCheckedChange={(checked) => handleSettingChange("push_live_streams", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <span>In-App Notifications</span>
          </CardTitle>
          <CardDescription>Control notifications shown within the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app_new_subscriber">New Subscribers</Label>
              <p className="text-sm text-muted-foreground">Show in-app notifications for new subscribers</p>
            </div>
            <Switch
              id="app_new_subscriber"
              checked={settings.app_new_subscriber}
              onCheckedChange={(checked) => handleSettingChange("app_new_subscriber", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app_new_comment">New Comments</Label>
              <p className="text-sm text-muted-foreground">Show in-app notifications for new comments</p>
            </div>
            <Switch
              id="app_new_comment"
              checked={settings.app_new_comment}
              onCheckedChange={(checked) => handleSettingChange("app_new_comment", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app_new_like">New Likes</Label>
              <p className="text-sm text-muted-foreground">Show in-app notifications for new likes</p>
            </div>
            <Switch
              id="app_new_like"
              checked={settings.app_new_like}
              onCheckedChange={(checked) => handleSettingChange("app_new_like", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>Set times when you don't want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quiet_hours_enabled">Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Pause notifications during specified hours</p>
            </div>
            <Switch
              id="quiet_hours_enabled"
              checked={settings.quiet_hours_enabled}
              onCheckedChange={(checked) => handleSettingChange("quiet_hours_enabled", checked)}
            />
          </div>

          {settings.quiet_hours_enabled && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet_hours_start">Start Time</Label>
                  <Select
                    value={settings.quiet_hours_start}
                    onValueChange={(value) => handleSettingChange("quiet_hours_start", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet_hours_end">End Time</Label>
                  <Select
                    value={settings.quiet_hours_end}
                    onValueChange={(value) => handleSettingChange("quiet_hours_end", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  )
}
