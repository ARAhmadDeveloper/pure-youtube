"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HelpCircle, MessageCircle, Book, Bug, Lightbulb, ExternalLink, Send, Phone, Mail, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface SupportSettingsProps {
  user: SupabaseUser
}

export function SupportSettings({ user }: SupportSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supportForm, setSupportForm] = useState({
    category: "",
    subject: "",
    message: "",
    priority: "medium",
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setSupportForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitTicket = async () => {
    if (!supportForm.category || !supportForm.subject || !supportForm.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate ticket submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you within 24 hours. Ticket ID: #12345",
      })

      setSupportForm({
        category: "",
        subject: "",
        message: "",
        priority: "medium",
      })
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit support ticket",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Quick Help</span>
          </CardTitle>
          <CardDescription>Find answers to common questions and issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
              <a href="#" className="flex items-center space-x-3">
                <Book className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">User Guide</p>
                  <p className="text-sm text-muted-foreground">Learn how to use VideoMe</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
              <a href="#" className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="font-medium">FAQ</p>
                  <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
              <a href="#" className="flex items-center space-x-3">
                <Bug className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <p className="font-medium">Known Issues</p>
                  <p className="text-sm text-muted-foreground">Current bugs and workarounds</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
              <a href="#" className="flex items-center space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <div className="text-left">
                  <p className="font-medium">Tips & Tricks</p>
                  <p className="text-sm text-muted-foreground">Get the most out of VideoMe</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </CardTitle>
          <CardDescription>Submit a support ticket for personalized help</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={supportForm.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account Problem</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="content">Content Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={supportForm.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={supportForm.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={supportForm.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Please provide detailed information about your issue..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">{supportForm.message.length}/2000 characters</p>
          </div>

          <Button
            onClick={handleSubmitTicket}
            disabled={isSubmitting || !supportForm.category || !supportForm.subject || !supportForm.message}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Support Ticket"}
          </Button>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader>
          <CardTitle>Support Information</CardTitle>
          <CardDescription>How to reach us and what to expect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Response Time</p>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Mail className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-muted-foreground">support@videome.com</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Phone className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Support Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-muted-foreground">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-muted-foreground">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Status</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Average Response</span>
                  <span className="text-muted-foreground">4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction Rate</span>
                  <span className="text-muted-foreground">98%</span>
                </div>
              </div>
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
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Video Upload Service</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Video Streaming</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Authentication</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">CDN</span>
              <Badge variant="default">Operational</Badge>
            </div>
          </div>

          <Separator />

          <div className="text-center">
            <Button variant="outline" asChild>
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
