"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  Search,
  Upload,
  Settings,
  User,
  Shield,
  MessageCircle,
  Play,
  Eye,
  Lock,
  Globe,
  Mail,
  Book,
  Bug,
  ExternalLink,
} from "lucide-react"

export function HelpContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("getting-started")

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Play,
      description: "Learn the basics of using VideoMe",
    },
    {
      id: "uploading",
      title: "Uploading Videos",
      icon: Upload,
      description: "How to upload and manage your videos",
    },
    {
      id: "watching",
      title: "Watching Videos",
      icon: Eye,
      description: "Tips for the best viewing experience",
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: User,
      description: "Manage your account and profile settings",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      description: "Keep your account safe and secure",
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: Bug,
      description: "Common issues and solutions",
    },
  ]

  const faqData = {
    "getting-started": [
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click the 'Sign Up' button in the top right corner of the homepage. You can sign up using your email address. After signing up, you'll receive a confirmation email to verify your account.",
      },
      {
        question: "How do I navigate the platform?",
        answer:
          "Use the sidebar on the left to navigate between different sections like Home, Trending, My Videos, Watch Later, and more. The header contains your profile menu and search functionality.",
      },
      {
        question: "What video formats are supported?",
        answer:
          "VideoMe supports most common video formats including MP4, AVI, MOV, WMV, and FLV. For best results, we recommend uploading videos in MP4 format with H.264 encoding.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "Free accounts have a 500MB per video limit and 5GB total storage. Pro accounts get 2GB per video and 50GB total storage. Business accounts have 5GB per video and 500GB total storage.",
      },
    ],
    uploading: [
      {
        question: "How do I upload a video?",
        answer:
          "Click the 'Upload' button in the sidebar or header. Select your video file, add a title and description, choose a thumbnail, and click 'Upload Video'. The video will be processed and available shortly.",
      },
      {
        question: "Why is my video still processing?",
        answer:
          "Video processing time depends on the file size and length. Most videos are processed within 5-15 minutes. Longer or higher quality videos may take up to an hour. You'll receive a notification when processing is complete.",
      },
      {
        question: "Can I edit video details after uploading?",
        answer:
          "Yes! Go to 'My Videos' and click the edit button on any video. You can change the title, description, thumbnail, and privacy settings at any time.",
      },
      {
        question: "How do I create custom thumbnails?",
        answer:
          "During upload, you can either select from auto-generated thumbnails or upload a custom image. Custom thumbnails should be 1280x720 pixels in JPG or PNG format for best results.",
      },
    ],
    watching: [
      {
        question: "How do I adjust video quality?",
        answer:
          "Click the settings gear icon in the video player and select your preferred quality. The player will automatically adjust based on your internet connection, but you can manually select from available options.",
      },
      {
        question: "Can I download videos for offline viewing?",
        answer:
          "Video downloads are available for videos where the creator has enabled this feature. Look for the download button below the video player. Downloaded videos are for personal use only.",
      },
      {
        question: "How do I use the watch later feature?",
        answer:
          "Click the 'Watch Later' button below any video or on the video card. Access your saved videos by clicking 'Watch Later' in the sidebar. You can remove videos from the list at any time.",
      },
      {
        question: "What are the keyboard shortcuts?",
        answer:
          "Space: Play/Pause, Left/Right arrows: Skip 10 seconds, Up/Down arrows: Volume, F: Fullscreen, M: Mute, 0-9: Jump to percentage of video, C: Toggle captions (if available).",
      },
    ],
    account: [
      {
        question: "How do I change my profile information?",
        answer:
          "Go to Settings > Account and update your profile picture, name, bio, and other details. Changes are saved automatically when you click 'Save Changes'.",
      },
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings > Security and enter your current password, then your new password twice. Make sure to use a strong password with at least 8 characters.",
      },
      {
        question: "Can I change my username?",
        answer:
          "Yes, you can change your username in Settings > Account. Note that changing your username will update your profile URL and may affect how others find your content.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Go to Settings > Data > Delete Account. This action is permanent and will remove all your videos, comments, and account data. Make sure to export your data first if needed.",
      },
    ],
    privacy: [
      {
        question: "How do I make my videos private?",
        answer:
          "When uploading or editing a video, set the privacy to 'Private'. Private videos are only visible to you. You can also set videos to 'Unlisted' to share with specific people via link.",
      },
      {
        question: "Who can see my profile?",
        answer:
          "By default, profiles are public. You can adjust privacy settings in Settings > Privacy to control what information is visible and who can contact you.",
      },
      {
        question: "How do I block or report users?",
        answer:
          "On any user's profile or comment, click the three dots menu and select 'Block User' or 'Report'. Blocked users cannot interact with your content or contact you.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes, we use industry-standard encryption and security measures. Your personal data is never sold to third parties. See our Privacy Policy for full details on data handling.",
      },
    ],
    troubleshooting: [
      {
        question: "Videos won't play or load slowly",
        answer:
          "Try refreshing the page, clearing your browser cache, or switching to a different browser. Check your internet connection and try lowering the video quality. If issues persist, contact support.",
      },
      {
        question: "Upload keeps failing",
        answer:
          "Ensure your video file is under the size limit and in a supported format. Check your internet connection stability. Try uploading during off-peak hours for better success rates.",
      },
      {
        question: "I can't sign in to my account",
        answer:
          "Double-check your email and password. Try resetting your password if needed. Clear your browser cookies and cache. If you're still having trouble, contact our support team.",
      },
      {
        question: "The website is running slowly",
        answer:
          "Clear your browser cache and cookies, disable browser extensions temporarily, or try using an incognito/private browsing window. Check if the issue persists across different devices.",
      },
    ],
  }

  const quickLinks = [
    {
      title: "Video Upload Guide",
      description: "Step-by-step guide to uploading your first video",
      icon: Upload,
      href: "#uploading",
    },
    {
      title: "Privacy Settings",
      description: "Learn how to control your privacy and security",
      icon: Lock,
      href: "#privacy",
    },
    {
      title: "Account Management",
      description: "Manage your profile and account settings",
      icon: Settings,
      href: "#account",
    },
    {
      title: "Community Guidelines",
      description: "Rules and guidelines for using VideoMe",
      icon: Globe,
      href: "#",
    },
  ]

  const filteredFAQ =
    faqData[activeCategory as keyof typeof faqData]?.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const ActiveIcon = helpCategories.find((cat) => cat.id === activeCategory)?.icon || HelpCircle

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <HelpCircle className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions and learn how to get the most out of VideoMe
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <link.icon className="w-8 h-8 mx-auto text-primary" />
              <h3 className="font-semibold">{link.title}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Help Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-4 hover:bg-muted transition-colors flex items-center space-x-3 ${
                      activeCategory === category.id ? "bg-muted border-r-2 border-primary" : ""
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{category.title}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ActiveIcon className="w-6 h-6" />
                <span>{helpCategories.find((cat) => cat.id === activeCategory)?.title}</span>
              </CardTitle>
              <CardDescription>{helpCategories.find((cat) => cat.id === activeCategory)?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQ.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQ.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse different categories
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <span>Still Need Help?</span>
          </CardTitle>
          <CardDescription>Can't find what you're looking for? Our support team is here to help</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-sm text-muted-foreground">Get help via email within 24 hours</p>
              <Button variant="outline" size="sm">
                Send Email
              </Button>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Chat with our support team in real-time</p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Book className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">User Guide</h3>
              <p className="text-sm text-muted-foreground">Comprehensive documentation and tutorials</p>
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current status of VideoMe services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Video Upload Service</span>
              </div>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Video Streaming</span>
              </div>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">User Authentication</span>
              </div>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Database</span>
              </div>
              <Badge variant="default">Operational</Badge>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" asChild>
              <a href="#" className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>View Full Status Page</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
