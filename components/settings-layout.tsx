"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { StorageSettings } from "@/components/settings/storage-settings"
import { DataSettings } from "@/components/settings/data-settings"
import { SupportSettings } from "@/components/settings/support-settings"
import { Settings, User, Shield, Bell, Lock, HardDrive, Database, HelpCircle } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface SettingsLayoutProps {
  user: SupabaseUser
  profile: any
  videoCount: number
  subscriptionCount: number
  subscriberCount: number
}

export function SettingsLayout({ user, profile, videoCount, subscriptionCount, subscriberCount }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4" />
            <span className="hidden sm:inline">Storage</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountSettings user={user} profile={profile} />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings user={user} profile={profile} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings user={user} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings user={user} />
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <StorageSettings user={user} videoCount={videoCount} />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataSettings
            user={user}
            videoCount={videoCount}
            subscriptionCount={subscriptionCount}
            subscriberCount={subscriberCount}
          />
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <SupportSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
