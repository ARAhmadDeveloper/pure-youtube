"use client"

import { useState } from "react"
import { SidebarToggle } from "./sidebar-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SidebarDemo() {
  const [headerOpen, setHeaderOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [floatingOpen, setFloatingOpen] = useState(false)
  const [variant, setVariant] = useState<"hamburger" | "chevron" | "menu">("hamburger")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Sidebar Toggle Demo</h1>
          <p className="text-gray-600 mb-6">
            Test different button positions and variants for the sidebar toggle functionality.
          </p>

          {/* Variant Selector */}
          <div className="flex gap-2 mb-6">
            <Button variant={variant === "hamburger" ? "default" : "outline"} onClick={() => setVariant("hamburger")}>
              Hamburger
            </Button>
            <Button variant={variant === "chevron" ? "default" : "outline"} onClick={() => setVariant("chevron")}>
              Chevron
            </Button>
            <Button variant={variant === "menu" ? "default" : "outline"} onClick={() => setVariant("menu")}>
              Menu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Header Position */}
          <Card>
            <CardHeader>
              <CardTitle>Header Position</CardTitle>
              <CardDescription>Toggle button integrated into the header bar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-center gap-4 p-2 border-b">
                  <SidebarToggle
                    isOpen={headerOpen}
                    onToggle={() => setHeaderOpen(!headerOpen)}
                    variant={variant}
                    position="header"
                  />
                  <span className="font-semibold">VideoMe</span>
                </div>
                <div className="p-4 text-sm text-gray-600">Status: {headerOpen ? "Open" : "Closed"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Position */}
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Position</CardTitle>
              <CardDescription>Toggle button on the sidebar edge with elevation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white relative">
                <div className="w-48 h-32 bg-gray-100 border-r relative">
                  <SidebarToggle
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    variant={variant}
                    position="sidebar"
                  />
                  <div className="p-4 text-sm text-gray-600">Sidebar Content</div>
                </div>
                <div className="mt-2 text-sm text-gray-600">Status: {sidebarOpen ? "Open" : "Closed"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Floating Position */}
          <Card>
            <CardHeader>
              <CardTitle>Floating Position</CardTitle>
              <CardDescription>Fixed position button with backdrop blur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white relative h-32 overflow-hidden">
                <SidebarToggle
                  isOpen={floatingOpen}
                  onToggle={() => setFloatingOpen(!floatingOpen)}
                  variant={variant}
                  position="floating"
                  className="!fixed !top-2 !left-2"
                />
                <div className="p-4 text-sm text-gray-600">Main Content Area</div>
                <div className="absolute bottom-2 right-2 text-sm text-gray-600">
                  Status: {floatingOpen ? "Open" : "Closed"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ARIA labels and expanded states</li>
                <li>• Keyboard navigation support</li>
                <li>• Screen reader friendly</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Animations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smooth transitions</li>
                <li>• Visual feedback</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
