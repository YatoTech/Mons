"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MousePointer, Keyboard, MessageCircle, Search, Bell, Zap, Target } from "lucide-react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const features = [
    {
      icon: MousePointer,
      title: "Drag & Drop",
      description: "Move tasks between columns by dragging them",
      tips: ["Click and hold a task card", "Drag to desired column", "Release to drop"],
    },
    {
      icon: MessageCircle,
      title: "Comments",
      description: "Add comments to tasks for collaboration",
      tips: ["Click on any task to open details", "Scroll to comments section", "Type and press Enter"],
    },
    {
      icon: Search,
      title: "Search",
      description: "Find tasks quickly using the search bar",
      tips: ["Use the search box in header", "Search by title or description", "Results update in real-time"],
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with task changes",
      tips: ["Configure in Settings", "Get notified of due dates", "Receive comment mentions"],
    },
  ]

  const shortcuts = [
    { key: "Ctrl + N", action: "Create new task" },
    { key: "Ctrl + F", action: "Focus search" },
    { key: "Ctrl + S", action: "Save current task" },
    { key: "Escape", action: "Close modal/dialog" },
    { key: "Enter", action: "Submit form" },
    { key: "Tab", action: "Navigate between fields" },
  ]

  const workflows = [
    {
      title: "Creating Your First Task",
      steps: [
        "Click the 'Add Task' button",
        "Fill in the task title (required)",
        "Add description and set priority",
        "Choose due date if needed",
        "Assign to yourself or leave unassigned",
        "Click 'Add Task' to create",
      ],
    },
    {
      title: "Managing Task Progress",
      steps: [
        "Drag tasks from 'To Do' to 'In Progress'",
        "Add comments to track progress",
        "Update task details as needed",
        "Move to 'Done' when completed",
        "Review completed tasks regularly",
      ],
    },
    {
      title: "Organizing Your Workspace",
      steps: [
        "Use priority levels (High, Medium, Low)",
        "Set due dates for time-sensitive tasks",
        "Add detailed descriptions",
        "Use search to find specific tasks",
        "Archive completed tasks periodically",
      ],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <span className="mr-2">📚</span>
            Help & User Guide
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <feature.icon className="w-5 h-5 mr-2 text-blue-600" />
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {feature.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            {tip}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Shortcuts Tab */}
            <TabsContent value="shortcuts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Keyboard className="w-5 h-5 mr-2" />
                    Keyboard Shortcuts
                  </CardTitle>
                  <CardDescription>Speed up your workflow with these keyboard shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">{shortcut.action}</span>
                        <Badge variant="outline" className="font-mono">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mouse Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Click task card</span>
                      <span className="text-sm text-gray-600">Open task details</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Drag task card</span>
                      <span className="text-sm text-gray-600">Move between columns</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Right click (future)</span>
                      <span className="text-sm text-gray-600">Context menu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflows Tab */}
            <TabsContent value="workflows" className="space-y-4">
              {workflows.map((workflow, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      {workflow.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workflow.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Tips & Tricks Tab */}
            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                    Productivity Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-900 mb-2">🎯 Set Clear Priorities</h4>
                      <p className="text-sm text-blue-800">
                        Use High priority for urgent tasks, Medium for important tasks, and Low for nice-to-have items.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-medium text-green-900 mb-2">📅 Use Due Dates Wisely</h4>
                      <p className="text-sm text-green-800">
                        Set realistic due dates and review them regularly. Don't set due dates for every task.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <h4 className="font-medium text-purple-900 mb-2">💬 Comment Effectively</h4>
                      <p className="text-sm text-purple-800">
                        Use comments to track progress, ask questions, or note important updates.
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <h4 className="font-medium text-orange-900 mb-2">🔍 Search Like a Pro</h4>
                      <p className="text-sm text-orange-800">
                        Search works on both titles and descriptions. Use specific keywords to find tasks quickly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Keep task titles short and descriptive</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Break large tasks into smaller subtasks</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Review and update your tasks daily</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Use descriptions for additional context</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">Archive completed tasks regularly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
