"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Target, Activity } from "lucide-react"
import type { User as UserType, Task } from "@/lib/types"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
  tasks: Task[]
}

export function ProfileModal({ isOpen, onClose, user, tasks }: ProfileModalProps) {
  const userTasks = tasks.filter((task) => task.assignee_id === user.id)
  const completedTasks = userTasks.filter((task) => task.status === "done")
  const inProgressTasks = userTasks.filter((task) => task.status === "in-progress")
  const todoTasks = userTasks.filter((task) => task.status === "todo")

  const completionRate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0

  const highPriorityTasks = userTasks.filter((task) => task.priority === "high")
  const overdueTasks = userTasks.filter(
    (task) => task.due_date && new Date(task.due_date) < new Date() && task.status !== "done",
  )

  const stats = [
    {
      title: "Total Tasks",
      value: userTasks.length,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: completedTasks.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "In Progress",
      value: inProgressTasks.length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const recentTasks = userTasks
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alerts */}
              {(highPriorityTasks.length > 0 || overdueTasks.length > 0) && (
                <div className="space-y-3">
                  {overdueTasks.length > 0 && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800">
                        {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {highPriorityTasks.length > 0 && (
                    <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">
                        {highPriorityTasks.length} high priority task{highPriorityTasks.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTasks.length > 0 ? (
                      recentTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">
                              Updated {new Date(task.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              task.status === "done"
                                ? "default"
                                : task.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {task.status.replace("-", " ")}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No tasks assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">To Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {todoTasks.map((task) => (
                        <div key={task.id} className="p-2 border rounded text-sm">
                          <p className="font-medium">{task.title}</p>
                          <Badge size="sm" variant="outline">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                      {todoTasks.length === 0 && <p className="text-gray-500 text-center py-4">No tasks</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {inProgressTasks.map((task) => (
                        <div key={task.id} className="p-2 border rounded text-sm">
                          <p className="font-medium">{task.title}</p>
                          <Badge size="sm" variant="secondary">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                      {inProgressTasks.length === 0 && <p className="text-gray-500 text-center py-4">No tasks</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {completedTasks.map((task) => (
                        <div key={task.id} className="p-2 border rounded text-sm">
                          <p className="font-medium">{task.title}</p>
                          <Badge size="sm" variant="default">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                      {completedTasks.length === 0 && <p className="text-gray-500 text-center py-4">No tasks</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTasks.slice(0, 10).map((task, index) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 border-l-2 border-blue-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Updated task:</span> {task.title}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(task.updated_at).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" size="sm">
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>
                    ))}
                    {recentTasks.length === 0 && <p className="text-gray-500 text-center py-8">No recent activity</p>}
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
