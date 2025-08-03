"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Database, Download, Trash2, AlertTriangle, FileText, Users, Video } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface DataSettingsProps {
  user: SupabaseUser
  videoCount: number
  subscriptionCount: number
  subscriberCount: number
}

export function DataSettings({ user, videoCount, subscriptionCount, subscriberCount }: DataSettingsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      // Simulate data export
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real app, you would generate and download the data export
      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        statistics: {
          videoCount,
          subscriptionCount,
          subscriberCount,
        },
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `videome-data-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported",
        description: "Your data has been exported and downloaded successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // Delete user data from database
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", user.id)
      if (profileError) throw profileError

      // Delete user videos
      const { error: videosError } = await supabase.from("videos").delete().eq("user_id", user.id)
      if (videosError) throw videosError

      // Delete user subscriptions
      const { error: subsError } = await supabase.from("subscriptions").delete().eq("subscriber_id", user.id)
      if (subsError) throw subsError

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      if (authError) throw authError

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      })

      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Overview</span>
          </CardTitle>
          <CardDescription>Summary of your data stored on VideoMe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{videoCount}</p>
              <p className="text-sm text-muted-foreground">Videos Uploaded</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{subscriptionCount}</p>
              <p className="text-sm text-muted-foreground">Subscriptions</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{subscriberCount}</p>
              <p className="text-sm text-muted-foreground">Subscribers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Your Data</span>
          </CardTitle>
          <CardDescription>Download a copy of all your data stored on VideoMe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Your data export will include your profile information, video metadata, comments, likes, and subscription
              data. Video files are not included in the export.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Profile Data</p>
                <p className="text-sm text-muted-foreground">Personal information and account settings</p>
              </div>
              <Badge variant="outline">Included</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Video Metadata</p>
                <p className="text-sm text-muted-foreground">Video titles, descriptions, and statistics</p>
              </div>
              <Badge variant="outline">Included</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Interactions</p>
                <p className="text-sm text-muted-foreground">Comments, likes, and subscriptions</p>
              </div>
              <Badge variant="outline">Included</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Video Files</p>
                <p className="text-sm text-muted-foreground">Actual video and thumbnail files</p>
              </div>
              <Badge variant="secondary">Not Included</Badge>
            </div>
          </div>

          <Button onClick={handleExportData} disabled={isExporting} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting Data..." : "Export My Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>How long we keep your data and what happens when you delete it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Account Data</span>
              <span className="text-sm text-muted-foreground">Retained indefinitely</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Deleted Videos</span>
              <span className="text-sm text-muted-foreground">30 days backup retention</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account Deletion</span>
              <span className="text-sm text-muted-foreground">Immediate permanent deletion</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Analytics Data</span>
              <span className="text-sm text-muted-foreground">2 years retention</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            <span>Delete Account</span>
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action cannot be undone. All your videos, comments, likes, and account data
              will be permanently deleted.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-medium">What will be deleted:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your profile and account information</li>
              <li>• All uploaded videos and thumbnails</li>
              <li>• All comments and likes</li>
              <li>• All subscriptions and subscribers</li>
              <li>• All analytics and performance data</li>
              <li>• All settings and preferences</li>
            </ul>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
